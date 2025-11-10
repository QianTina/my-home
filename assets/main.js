const data = {
  highlights: [
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
  ],
  timeline: [
    {
      date: '4月12日（周五）',
      title: '妹妹美术作品入展',
      description: '学校春季艺术展开展，妹妹的水彩作品《春醒》成功入选，全家前往支持。',
      tags: ['艺术', '校园'],
      location: '市文化中心'
    },
    {
      date: '4月14日（周日）',
      title: '家庭种植日',
      description: '后院花圃翻新，全家一起种下薄荷、迷迭香和番茄苗，并记录成长日志。',
      tags: ['家庭日', '自然'],
      location: '家中后院'
    },
    {
      date: '4月21日（周日）',
      title: '春季城市微旅行',
      description: '计划前往城北旧街区探访手作市集，品尝当地小吃，并拍摄家庭 Vlog。',
      tags: ['旅行计划'],
      location: '城北旧街区'
    }
  ],
  members: [
    {
      name: '爸爸',
      role: '家庭主厨 & 摄影爱好者',
      avatar: '👨‍🍳',
      focus: ['低油健康餐', '照片整理'],
      note: '正在研究如何将家庭食谱整理成电子书，每周坚持拍摄家庭 vlog。'
    },
    {
      name: '妈妈',
      role: '行程规划师 & 情绪管家',
      avatar: '👩‍💼',
      focus: ['瑜伽晨练', '亲子阅读'],
      note: '本月主导家庭共读《岛上书店》，同时计划夏季旅行路线。'
    },
    {
      name: '哥哥',
      role: '科技探索者',
      avatar: '🧑‍💻',
      focus: ['编程比赛', '单反摄影'],
      note: '准备参加青少年创客比赛，使用树莓派打造家庭空气质量监测器。'
    },
    {
      name: '妹妹',
      role: '小小艺术家',
      avatar: '🧑‍🎨',
      focus: ['水彩练习', '自然观察'],
      note: '正在创作春季植物主题手账，并负责记录家庭植物生长变化。'
    }
  ],
  gallery: [
    {
      title: '春游踏青',
      description: '三月的郊外，油菜花与蓝天作伴的全家福。',
      photo: 'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(56,189,248,0.6)), url(https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80)',
      date: '2024-03-24'
    },
    {
      title: '厨房实验室',
      description: '周末的披萨 DIY，大人小孩各自设计口味。',
      photo: 'linear-gradient(135deg, rgba(249,115,22,0.6), rgba(255,228,181,0.4)), url(https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80)',
      date: '2024-03-31'
    },
    {
      title: '阅读时光',
      description: '客厅的午后，阳光与书香相伴。',
      photo: 'linear-gradient(135deg, rgba(244,114,182,0.55), rgba(251,191,36,0.45)), url(https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80)',
      date: '2024-04-06'
    }
  ],
  tasks: [
    {
      category: '家务分工',
      tasks: [
        { title: '厨房大扫除', assignee: '爸爸 & 哥哥', detail: '周三晚饭后进行，重点清洁油烟机和调料架。' },
        { title: '阳台植物浇水', assignee: '妹妹', detail: '隔天一次，记录在植物成长表里。' }
      ]
    },
    {
      category: '学习与成长',
      tasks: [
        { title: '英语角分享', assignee: '妈妈', detail: '准备周五的家庭英语角主题：旅行英语。' },
        { title: '编程练习', assignee: '哥哥', detail: '完成 Python 项目练习，周日分享成果。' }
      ]
    },
    {
      category: '健康与运动',
      tasks: [
        { title: '瑜伽晨练', assignee: '全家参与', detail: '每周二、四早上 7:00，跟随线上课程练习。' },
        { title: '周末徒步', assignee: '全家', detail: '选择 5 公里轻量路线，记录心率与步数。' }
      ]
    }
  ],
  recipes: [
    {
      title: '清爽柠檬烤鸡胸',
      tags: ['低脂', '30 分钟'],
      description: '腌制 20 分钟后用空气炸锅烤 12 分钟，配烤时蔬，适合忙碌的工作日晚餐。'
    },
    {
      title: '春日青酱意面',
      tags: ['素食', '家庭最爱'],
      description: '使用罗勒、菠菜和松子制作酱料，加入时令芦笋与小番茄。'
    },
    {
      title: '莓果燕麦杯',
      tags: ['早餐', '无糖'],
      description: '隔夜燕麦与蓝莓草莓搭配坚果碎，冰箱冷藏一晚即可享用。'
    }
  ]
};

function renderHighlights() {
  const list = document.getElementById('weeklyHighlights');
  list.innerHTML = '';
  data.highlights.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'highlight-item';
    li.innerHTML = `
      <span class="highlight-item__badge">${index + 1}</span>
      <div class="highlight-item__body">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    list.appendChild(li);
  });
}

function renderTimeline() {
  const list = document.getElementById('timelineList');
  list.innerHTML = '';
  data.timeline.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'timeline-item';
    li.innerHTML = `
      <span class="timeline-item__dot" aria-hidden="true"></span>
      <span class="timeline-item__date">${item.date}</span>
      <div class="timeline-item__card">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="timeline-item__meta">
          <span>地点：${item.location}</span>
          <span>标签：${item.tags.join(' / ')}</span>
        </div>
      </div>
    `;
    list.appendChild(li);
  });
}

function renderMembers() {
  const container = document.getElementById('memberCards');
  container.innerHTML = '';
  data.members.forEach((member) => {
    const article = document.createElement('article');
    article.className = 'member-card';
    article.setAttribute('role', 'listitem');
    article.innerHTML = `
      <div class="member-card__avatar" aria-hidden="true">${member.avatar}</div>
      <div>
        <h3 class="member-card__name">${member.name}</h3>
        <p class="member-card__role">${member.role}</p>
      </div>
      <div class="member-card__tags" aria-label="关注事项">
        ${member.focus.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <p class="member-card__note">${member.note}</p>
    `;
    container.appendChild(article);
  });
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';
  data.gallery.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'gallery-card';
    card.innerHTML = `
      <div class="gallery-card__photo" style="background-image: ${item.photo};" role="img" aria-label="${item.title}"></div>
      <div class="gallery-card__info">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p class="gallery-card__date">日期：${item.date}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderTasks() {
  const board = document.getElementById('tasksBoard');
  board.innerHTML = '';
  data.tasks.forEach((column) => {
    const section = document.createElement('section');
    section.className = 'task-column';
    section.innerHTML = `
      <h3>${column.category}<span class="task-column__count">${column.tasks.length} 项</span></h3>
      <ul class="task-list">
        ${column.tasks
          .map(
            (task) => `
              <li class="task-item">
                <p class="task-item__title">${task.title}</p>
                <p class="task-item__meta">负责人：${task.assignee}</p>
                <p class="task-item__meta">${task.detail}</p>
              </li>
            `
          )
          .join('')}
      </ul>
    `;
    board.appendChild(section);
  });
}

function renderRecipes() {
  const grid = document.getElementById('recipeGrid');
  grid.innerHTML = '';
  data.recipes.forEach((recipe) => {
    const article = document.createElement('article');
    article.className = 'recipe-card';
    article.innerHTML = `
      <h3>${recipe.title}</h3>
      <div class="recipe-card__tags">
        ${recipe.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <p class="recipe-card__detail">${recipe.description}</p>
    `;
    grid.appendChild(article);
  });
}

function setupWishForm() {
  const form = document.querySelector('.contact-form');
  const toast = document.querySelector('.toast');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const wish = formData.get('content');
    toast.querySelector('.toast__text').textContent = `${name || '家人'}的愿望已记录：${wish || '请记得补充愿望内容'}`;
    showToast(toast);
    form.reset();
    form.querySelector('input, textarea').focus();
  });
}

function showToast(element) {
  element.hidden = false;
  element.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    element.setAttribute('aria-hidden', 'true');
  }, 2800);
  setTimeout(() => {
    element.hidden = true;
  }, 3200);
}

function setFooterYear() {
  const year = new Date().getFullYear();
  document.getElementById('copyrightYear').textContent = year;
}

function init() {
  renderHighlights();
  renderTimeline();
  renderMembers();
  renderGallery();
  renderTasks();
  renderRecipes();
  setupWishForm();
  setFooterYear();
}

document.addEventListener('DOMContentLoaded', init);
