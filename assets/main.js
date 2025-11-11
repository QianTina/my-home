const DATA_URL = '/api/data';

function renderHighlights(highlights = [], fallbackMessage = '暂无本周亮点，快来添加新计划！') {
  const list = document.getElementById('weeklyHighlights');
  list.innerHTML = '';

  if (!Array.isArray(highlights) || highlights.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'highlight-item highlight-item--empty empty-state';
    emptyItem.textContent = fallbackMessage;
    list.appendChild(emptyItem);
    return;
  }

  highlights.forEach((item, index) => {
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

function renderTimeline(items = [], fallbackMessage = '近期还没有新的事件，快来添加一条吧！') {
  const list = document.getElementById('timelineList');
  list.innerHTML = '';

  if (!Array.isArray(items) || items.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'timeline-empty empty-state';
    emptyItem.textContent = fallbackMessage;
    list.appendChild(emptyItem);
    return;
  }

  items.forEach((item) => {
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
          <span>标签：${Array.isArray(item.tags) ? item.tags.join(' / ') : ''}</span>
        </div>
      </div>
    `;
    list.appendChild(li);
  });
}

function renderMembers(members = [], fallbackMessage = '暂未添加家庭成员信息。') {
  const container = document.getElementById('memberCards');
  container.innerHTML = '';

  if (!Array.isArray(members) || members.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = fallbackMessage;
    container.appendChild(empty);
    return;
  }

  members.forEach((member) => {
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
        ${(member.focus || []).map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <p class="member-card__note">${member.note}</p>
    `;
    container.appendChild(article);
  });
}

function renderGallery(items = [], fallbackMessage = '相册里还空着，去上传一张新照片吧！') {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';

  if (!Array.isArray(items) || items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = fallbackMessage;
    grid.appendChild(empty);
    return;
  }

  items.forEach((item) => {
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

function renderTasks(columns = [], fallbackMessage = '暂无待办事项，享受放松的家庭时光吧！') {
  const board = document.getElementById('tasksBoard');
  board.innerHTML = '';

  if (!Array.isArray(columns) || columns.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = fallbackMessage;
    board.appendChild(empty);
    return;
  }

  columns.forEach((column) => {
    const section = document.createElement('section');
    section.className = 'task-column';
    section.innerHTML = `
      <h3>${column.category}<span class="task-column__count">${(column.tasks || []).length} 项</span></h3>
      <ul class="task-list">
        ${(column.tasks || [])
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

function renderRecipes(recipes = [], fallbackMessage = '厨房里还没有收藏的菜谱。') {
  const grid = document.getElementById('recipeGrid');
  grid.innerHTML = '';

  if (!Array.isArray(recipes) || recipes.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = fallbackMessage;
    grid.appendChild(empty);
    return;
  }

  recipes.forEach((recipe) => {
    const article = document.createElement('article');
    article.className = 'recipe-card';
    article.innerHTML = `
      <h3>${recipe.title}</h3>
      <div class="recipe-card__tags">
        ${(recipe.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <p class="recipe-card__detail">${recipe.description}</p>
    `;
    grid.appendChild(article);
  });
}

function updateToast(toast, message, type = 'info') {
  if (!toast) {
    return;
  }

  const icon = toast.querySelector('.toast__icon');
  const text = toast.querySelector('.toast__text');

  if (text) {
    text.textContent = message;
  }

  if (icon) {
    const icons = {
      success: '✨',
      error: '⚠️',
      info: '💡',
    };
    icon.textContent = icons[type] || icons.info;
  }

  toast.classList.remove('toast--success', 'toast--error', 'toast--info');
  toast.classList.add(`toast--${type}`);
}

async function submitWish(form, toast) {
  const formData = new FormData(form);
  const payload = {
    name: (formData.get('name') || '').toString().trim(),
    category: (formData.get('category') || '').toString().trim(),
    content: (formData.get('content') || '').toString().trim(),
  };

  if (!payload.content) {
    updateToast(toast, '请填写愿望内容，再提交哦！', 'error');
    showToast(toast);
    return;
  }

  try {
    const response = await fetch('/api/wishes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error || '保存愿望失败，请稍后再试。');
    }

    const result = await response.json().catch(() => ({}));
    const name = payload.name || '家人';
    updateToast(
      toast,
      result?.message || `${name}的愿望已保存，我们会尽快安排！`,
      'success'
    );
    form.reset();
    const firstField = form.querySelector('input, select, textarea');
    if (firstField) {
      firstField.focus();
    }
  } catch (error) {
    updateToast(
      toast,
      error?.message || '保存愿望失败，请稍后再试。',
      'error'
    );
  } finally {
    showToast(toast);
  }
}

function setupWishForm() {
  const form = document.querySelector('.contact-form');
  const toast = document.querySelector('.toast');

  if (!form || !toast) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitWish(form, toast);
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

function renderAll(data) {
  renderHighlights(data?.highlights);
  renderTimeline(data?.timeline);
  renderMembers(data?.members);
  renderGallery(data?.gallery);
  renderTasks(data?.tasks);
  renderRecipes(data?.recipes);
}

async function loadData() {
  renderHighlights([], '正在加载数据…');
  renderTimeline([], '正在加载数据…');
  renderMembers([], '正在加载数据…');
  renderGallery([], '正在加载数据…');
  renderTasks([], '正在加载数据…');
  renderRecipes([], '正在加载数据…');

  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`);
    }
    const payload = await response.json();
    renderAll(payload);
  } catch (error) {
    console.error('加载家庭数据失败', error);
    const message = '暂时无法连接到家庭数据库，请确认服务器已启动。';
    renderHighlights([], message);
    renderTimeline([], message);
    renderMembers([], message);
    renderGallery([], message);
    renderTasks([], message);
    renderRecipes([], message);
  }
}

function init() {
  setupWishForm();
  setFooterYear();
  loadData();
}

document.addEventListener('DOMContentLoaded', init);
