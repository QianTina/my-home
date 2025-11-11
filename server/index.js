const path = require('path');
const fs = require('fs');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');
const DB_PATH = path.join(__dirname, 'family.db');

if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function handleRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

async function seedTable(countQuery, seedFn) {
  const existing = await get(countQuery);
  if (!existing || existing.count === 0) {
    await seedFn();
  }
}

async function initialiseDatabase() {
  await run('PRAGMA foreign_keys = ON;');

  await run(`
    CREATE TABLE IF NOT EXISTS highlights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS timeline_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS timeline_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL REFERENCES timeline_events(id) ON DELETE CASCADE,
      tag TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT NOT NULL,
      note TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS member_focus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      tag TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      photo TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS task_columns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      column_id INTEGER NOT NULL REFERENCES task_columns(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      assignee TEXT NOT NULL,
      detail TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS recipe_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      tag TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS wishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  await seedTable('SELECT COUNT(*) AS count FROM highlights;', async () => {
    const highlights = [
      {
        title: '春日家庭骑行日',
        description: '周六上午 9:00 集合，沿河绿道骑行 15 公里，午餐自备便当。',
      },
      {
        title: '爷爷奶奶视频聚会',
        description: '周日晚 7:30 线上见面，分享近期趣事和健康近况。',
      },
      {
        title: '厨房新菜挑战',
        description: '本周尝试无油空气炸锅菜式，家人投票选出最佳作品。',
      },
    ];

    for (const item of highlights) {
      await run('INSERT INTO highlights (title, description) VALUES (?, ?);', [
        item.title,
        item.description,
      ]);
    }
  });

  await seedTable('SELECT COUNT(*) AS count FROM timeline_events;', async () => {
    const events = [
      {
        date: '4月12日（周五）',
        title: '妹妹美术作品入展',
        description: '学校春季艺术展开展，妹妹的水彩作品《春醒》成功入选，全家前往支持。',
        location: '市文化中心',
        tags: ['艺术', '校园'],
      },
      {
        date: '4月14日（周日）',
        title: '家庭种植日',
        description: '后院花圃翻新，全家一起种下薄荷、迷迭香和番茄苗，并记录成长日志。',
        location: '家中后院',
        tags: ['家庭日', '自然'],
      },
      {
        date: '4月21日（周日）',
        title: '春季城市微旅行',
        description: '计划前往城北旧街区探访手作市集，品尝当地小吃，并拍摄家庭 Vlog。',
        location: '城北旧街区',
        tags: ['旅行计划'],
      },
    ];

    for (const event of events) {
      const { id } = await run(
        'INSERT INTO timeline_events (date, title, description, location) VALUES (?, ?, ?, ?);',
        [event.date, event.title, event.description, event.location]
      );

      for (const tag of event.tags) {
        await run('INSERT INTO timeline_tags (event_id, tag) VALUES (?, ?);', [
          id,
          tag,
        ]);
      }
    }
  });

  await seedTable('SELECT COUNT(*) AS count FROM members;', async () => {
    const members = [
      {
        name: '爸爸',
        role: '家庭主厨 & 摄影爱好者',
        avatar: '👨‍🍳',
        note: '正在研究如何将家庭食谱整理成电子书，每周坚持拍摄家庭 vlog。',
        focus: ['低油健康餐', '照片整理'],
      },
      {
        name: '妈妈',
        role: '行程规划师 & 情绪管家',
        avatar: '👩‍💼',
        note: '本月主导家庭共读《岛上书店》，同时计划夏季旅行路线。',
        focus: ['瑜伽晨练', '亲子阅读'],
      },
      {
        name: '哥哥',
        role: '科技探索者',
        avatar: '🧑‍💻',
        note: '准备参加青少年创客比赛，使用树莓派打造家庭空气质量监测器。',
        focus: ['编程比赛', '单反摄影'],
      },
      {
        name: '妹妹',
        role: '小小艺术家',
        avatar: '🧑‍🎨',
        note: '正在创作春季植物主题手账，并负责记录家庭植物生长变化。',
        focus: ['水彩练习', '自然观察'],
      },
    ];

    for (const member of members) {
      const { id } = await run(
        'INSERT INTO members (name, role, avatar, note) VALUES (?, ?, ?, ?);',
        [member.name, member.role, member.avatar, member.note]
      );

      for (const tag of member.focus) {
        await run('INSERT INTO member_focus (member_id, tag) VALUES (?, ?);', [
          id,
          tag,
        ]);
      }
    }
  });

  await seedTable('SELECT COUNT(*) AS count FROM gallery_items;', async () => {
    const gallery = [
      {
        title: '春游踏青',
        description: '三月的郊外，油菜花与蓝天作伴的全家福。',
        photo:
          "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(56,189,248,0.6)), url(https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80)",
        date: '2024-03-24',
      },
      {
        title: '厨房实验室',
        description: '周末的披萨 DIY，大人小孩各自设计口味。',
        photo:
          "linear-gradient(135deg, rgba(249,115,22,0.6), rgba(255,228,181,0.4)), url(https://images.unsplash.com/photo-1547592180851-152116190554?auto=format&fit=crop&w=800&q=80)",
        date: '2024-03-31',
      },
      {
        title: '阅读时光',
        description: '客厅的午后，阳光与书香相伴。',
        photo:
          "linear-gradient(135deg, rgba(244,114,182,0.55), rgba(251,191,36,0.45)), url(https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80)",
        date: '2024-04-06',
      },
    ];

    for (const item of gallery) {
      await run(
        'INSERT INTO gallery_items (title, description, photo, date) VALUES (?, ?, ?, ?);',
        [item.title, item.description, item.photo, item.date]
      );
    }
  });

  await seedTable('SELECT COUNT(*) AS count FROM task_columns;', async () => {
    const columns = [
      {
        category: '家务分工',
        tasks: [
          {
            title: '厨房大扫除',
            assignee: '爸爸 & 哥哥',
            detail: '周三晚饭后进行，重点清洁油烟机和调料架。',
          },
          {
            title: '阳台植物浇水',
            assignee: '妹妹',
            detail: '隔天一次，记录在植物成长表里。',
          },
        ],
      },
      {
        category: '学习与成长',
        tasks: [
          {
            title: '英语角分享',
            assignee: '妈妈',
            detail: '准备周五的家庭英语角主题：旅行英语。',
          },
          {
            title: '编程练习',
            assignee: '哥哥',
            detail: '完成 Python 项目练习，周日分享成果。',
          },
        ],
      },
      {
        category: '健康运动',
        tasks: [
          {
            title: '瑜伽晨练',
            assignee: '全家参与',
            detail: '每周二、四早上 7:00，跟随线上课程练习。',
          },
          {
            title: '周末徒步',
            assignee: '全家',
            detail: '选择 5 公里轻量路线，记录心率与步数。',
          },
        ],
      },
    ];

    for (const column of columns) {
      const { id } = await run('INSERT INTO task_columns (category) VALUES (?);', [
        column.category,
      ]);

      for (const task of column.tasks) {
        await run(
          'INSERT INTO tasks (column_id, title, assignee, detail) VALUES (?, ?, ?, ?);',
          [id, task.title, task.assignee, task.detail]
        );
      }
    }
  });

  await seedTable('SELECT COUNT(*) AS count FROM recipes;', async () => {
    const recipes = [
      {
        title: '清爽柠檬烤鸡胸',
        description: '腌制 20 分钟后用空气炸锅烤 12 分钟，配烤时蔬，适合忙碌的工作日晚餐。',
        tags: ['低脂', '30 分钟'],
      },
      {
        title: '春日青酱意面',
        description: '使用罗勒、菠菜和松子制作酱料，加入时令芦笋与小番茄。',
        tags: ['素食', '家庭最爱'],
      },
      {
        title: '莓果燕麦杯',
        description: '隔夜燕麦与蓝莓草莓搭配坚果碎，冰箱冷藏一晚即可享用。',
        tags: ['早餐', '无糖'],
      },
    ];

    for (const recipe of recipes) {
      const { id } = await run('INSERT INTO recipes (title, description) VALUES (?, ?);', [
        recipe.title,
        recipe.description,
      ]);

      for (const tag of recipe.tags) {
        await run('INSERT INTO recipe_tags (recipe_id, tag) VALUES (?, ?);', [
          id,
          tag,
        ]);
      }
    }
  });
}

async function buildResponsePayload() {
  const [highlights, timeline, timelineTags, members, memberFocus, gallery, columns, tasks, recipes, recipeTags] =
    await Promise.all([
      all('SELECT id, title, description FROM highlights ORDER BY id;'),
      all('SELECT id, date, title, description, location FROM timeline_events ORDER BY id;'),
      all('SELECT event_id, tag FROM timeline_tags ORDER BY id;'),
      all('SELECT id, name, role, avatar, note FROM members ORDER BY id;'),
      all('SELECT member_id, tag FROM member_focus ORDER BY id;'),
      all('SELECT title, description, photo, date FROM gallery_items ORDER BY id;'),
      all('SELECT id, category FROM task_columns ORDER BY id;'),
      all('SELECT column_id, title, assignee, detail FROM tasks ORDER BY id;'),
      all('SELECT id, title, description FROM recipes ORDER BY id;'),
      all('SELECT recipe_id, tag FROM recipe_tags ORDER BY id;'),
    ]);

  const timelineTagMap = timelineTags.reduce((acc, row) => {
    if (!acc[row.event_id]) {
      acc[row.event_id] = [];
    }
    acc[row.event_id].push(row.tag);
    return acc;
  }, {});

  const memberFocusMap = memberFocus.reduce((acc, row) => {
    if (!acc[row.member_id]) {
      acc[row.member_id] = [];
    }
    acc[row.member_id].push(row.tag);
    return acc;
  }, {});

  const taskMap = tasks.reduce((acc, row) => {
    if (!acc[row.column_id]) {
      acc[row.column_id] = [];
    }
    acc[row.column_id].push({
      title: row.title,
      assignee: row.assignee,
      detail: row.detail,
    });
    return acc;
  }, {});

  const recipeTagMap = recipeTags.reduce((acc, row) => {
    if (!acc[row.recipe_id]) {
      acc[row.recipe_id] = [];
    }
    acc[row.recipe_id].push(row.tag);
    return acc;
  }, {});

  return {
    highlights: highlights.map(({ title, description }) => ({ title, description })),
    timeline: timeline.map((item) => ({
      date: item.date,
      title: item.title,
      description: item.description,
      location: item.location,
      tags: timelineTagMap[item.id] || [],
    })),
    members: members.map((member) => ({
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      note: member.note,
      focus: memberFocusMap[member.id] || [],
    })),
    gallery: gallery.map((item) => ({
      title: item.title,
      description: item.description,
      photo: item.photo,
      date: item.date,
    })),
    tasks: columns.map((column) => ({
      category: column.category,
      tasks: taskMap[column.id] || [],
    })),
    recipes: recipes.map((recipe) => ({
      title: recipe.title,
      description: recipe.description,
      tags: recipeTagMap[recipe.id] || [],
    })),
  };
}

app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const payload = await buildResponsePayload();
    res.json(payload);
  } catch (error) {
    console.error('Failed to load family data', error);
    res.status(500).json({ error: '无法从数据库加载家庭数据' });
  }
});

app.post('/api/wishes', async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const category = typeof req.body?.category === 'string' ? req.body.category.trim() : '';
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';

  if (!content) {
    res.status(400).json({ error: '愿望内容不能为空' });
    return;
  }

  try {
    await run('INSERT INTO wishes (name, category, content) VALUES (?, ?, ?);', [
      name || '匿名家人',
      category || '其他',
      content,
    ]);

    res.status(201).json({ message: '愿望已保存到家庭数据库！' });
  } catch (error) {
    console.error('Failed to save wish', error);
    res.status(500).json({ error: '保存愿望失败，请稍后再试。' });
  }
});

app.use(express.static(ROOT_DIR));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: '接口不存在' });
    return;
  }

  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

initialiseDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`家庭主页服务已启动：http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('无法初始化数据库', error);
    process.exit(1);
  });
