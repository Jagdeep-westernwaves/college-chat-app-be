const db = require("../models");
const config = require("../config/db.config");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const dotenv = require("dotenv");
const { Validator } = require("node-input-validator");
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
const helpers = require("../helpers/helpers");
exports.getAllLogs = async (req, res) => {
  try {
    const jwt_token = await jwt.verify(
      req.headers.authorization,
      process.env.TOKEN_SECRET
    );
    let user_id = jwt_token.id;
    const user = await User.findOne({
      attributes: ["role", "organization_id", "time_zone"],
      where: {
        user_id: user_id,
      },
    });
    const admin_organization_id = user.organization_id;
    let whereCond = "";

    if (user.role !== 1) {
      if (admin_organization_id != null && admin_organization_id !== "") {
        const orgIds = admin_organization_id.split(",");
        if (orgIds.length === 1) {
          whereCond = ` and (FIND_IN_SET('${orgIds[0]}', users.organization_id) > 0 or logs.user_id = ${user_id}) or (logs.object_name= 'organization' and logs.item_id = '${orgIds[0]}')`;
        } else {
          whereCond = ` and ((users.organization_id in (${orgIds.join(
            ","
          )})) or logs.user_id = ${user_id}) or (logs.object_name= 'organization' and logs.item_id in (${orgIds.join(
            ","
          )}))`;
        }
      } else {
        whereCond = ` and logs.user_id = ${user_id}`;
      }
    }

    const page = req.query.page || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start_date = req.query.start_date + " 00:00:00";
    const end_date = req.query.end_date + " 23:59:59";
    const offset = (page - 1) * limit;
    const timezone_offset = await helpers.getTimezoneOffset(user.time_zone);
    const [total] = await db.sequelize.query(
      "SELECT count(*) as total_records from logs JOIN users ON users.user_id = logs.user_id WHERE logs.created_at >= :start_date AND logs.created_at <= :end_date " +
        whereCond +
        " ORDER BY id DESC",
      {
        replacements: {
          start_date: start_date,
          end_date: end_date,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    const query = `
          SELECT logs.id, users.organization_id, logs.user_id, concat(users.first_name, " ", users.last_name) AS action_by, role_name AS role, item_id, action_id, log_actions.action, remark, DATE_FORMAT(CONVERT_TZ(logs.created_at, "+00:00", ?), "%H:%i %d/%m/%Y") as created_at
          FROM logs
          LEFT JOIN log_actions ON logs.action_id = log_actions.id
          JOIN users ON users.user_id = logs.user_id
          JOIN roles ON users.role = roles.role_id
          WHERE logs.created_at >= ? AND logs.created_at <= ?
          ${whereCond}
          ORDER BY id DESC
          LIMIT ? OFFSET ?`;

    const replacements = [timezone_offset, start_date, end_date, limit, offset];

    const results = await db.sequelize.query(query, {
      replacements,
      type: db.sequelize.QueryTypes.SELECT,
    });

    const [log_actions] = await db.sequelize.query(
      "select id,action from log_actions"
    );
    let new_log_actions = [];
    const translatedLogActions = log_actions.map((log) => {
      const translatedAction = req.t(log.action);
      new_log_actions.push({ value: log.id, name: translatedAction });
    });
    return res.status(200).send({
      status: true,
      log_actions: new_log_actions,
      data: results,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total.total_records / limit),
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
exports.lockerLogs = async (payload, topic) => {
  try {
    const jwt_token = await jwt.verify(payload.token, process.env.TOKEN_SECRET);
    const page = parseInt(payload.page) || 1;
    const limit = parseInt(payload.limit) || 10;
    const start_date = payload.start_date;
    const end_date = payload.end_date;
    const offset = (page - 1) * limit;
    const query = `
          SELECT count(*) as total_records
          FROM logs
          WHERE logs.created_at >= :start_date
            AND logs.created_at <= :end_date
            AND remark LIKE :topic
            AND action_id=5
        `;
    console.log(topic);
    const replacements = {
      start_date: start_date,
      end_date: end_date,
      topic: `%${topic}%`,
    };

    const [result] = await db.sequelize.query(query, {
      replacements,
      type: db.sequelize.QueryTypes.SELECT,
    });

    const totalRecords = result.total_records;

    const query2 = `
          SELECT logs.id, logs.user_id, concat(users.first_name, " ", users.last_name) AS action_by, role_name AS role, item_id, action_id, log_actions.action, remark, logs.created_at
          FROM logs
          LEFT JOIN log_actions ON logs.action_id = log_actions.id
          JOIN users ON users.user_id = logs.user_id
          JOIN roles ON users.role = roles.role_id
          WHERE remark LIKE :topic
            AND action_id = 5
            AND logs.created_at >= :start_date
            AND logs.created_at <= :end_date
          ORDER BY id DESC
          LIMIT :limit OFFSET :offset
        `;

    const replacements2 = {
      topic: `%${topic}%`,
      start_date: start_date,
      end_date: end_date,
      limit: limit,
      offset: offset,
    };

    const results = await db.sequelize.query(query2, {
      replacements: replacements2,
      type: db.sequelize.QueryTypes.SELECT,
    });

    return {
      status: true,
      data: results,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: error.message,
    };
  }
};

exports.getRealTimeLogs = async (req, res) => {
  try {
    const jwt_token = await jwt.verify(
      req.headers.authorization,
      process.env.TOKEN_SECRET
    );
    let user_id = jwt_token.id;
    const user = await User.findOne({
      attributes: ["role", "organization_id", "time_zone"],
      where: {
        user_id: user_id,
      },
    });
    const admin_organization_id = user.organization_id;
    let whereCond = "";
    const timezone_offset = await helpers.getTimezoneOffset(user.time_zone);
    if (user.role !== 1) {
      if (admin_organization_id != null && admin_organization_id !== "") {
        const orgIds = admin_organization_id.split(",");
        if (orgIds.length === 1) {
          whereCond = ` WHERE (FIND_IN_SET('${orgIds[0]}', users.organization_id) > 0 or logs.user_id = ${user_id}) or (logs.object_name= 'organization' and logs.item_id = '${orgIds[0]}')`;
        } else {
          whereCond = ` WHERE ((users.organization_id in (${orgIds.join(
            ","
          )})) or logs.user_id = ${user_id}) or (logs.object_name= 'organization' and logs.item_id in (${orgIds.join(
            ","
          )}))`;
        }
      } else {
        whereCond = ` WHERE logs.user_id = ${user_id}`;
      }
    }

    const logActions = await db.sequelize.query(
      "SELECT id, action FROM log_actions",
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const checkLogs = await db.sequelize.query(
      'SELECT logs.id, logs.user_id, CONCAT(users.first_name, " ", users.last_name) AS action_by, role_name AS role, item_id, action_id, log_actions.action, remark, DATE_FORMAT(CONVERT_TZ(logs.created_at, "+00:00", :timezone_offset), "%H:%i %d/%m/%Y") AS created_at FROM logs LEFT JOIN log_actions ON logs.action_id = log_actions.id JOIN users ON users.user_id = logs.user_id JOIN roles ON users.role = roles.role_id ' +
        whereCond +
        " ORDER BY id DESC LIMIT 100",
      {
        replacements: {
          timezone_offset: timezone_offset,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    console.log(logActions);

    let new_log_actions = [];
    const translatedLogActions = logActions.map((log) => {
      const translatedAction = req.t(log.action);
      new_log_actions.push({ value: log.id, action: translatedAction });
    });

    return res.status(200).send({
      status: true,
      log_actions: new_log_actions,
      data: checkLogs,
    });
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};
