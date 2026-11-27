const data = {
  7: {metrics:[['ПРОСМОТРЫ','284 610','↑ 18,4%','к прошлой неделе'],['СР. ВРЕМЯ ПРОСМОТРА','12,8 сек','↑ 1,2 сек','к прошлой неделе'],['ПЕРЕХОДЫ','1 482','↑ 9,1%','атрибутировано'],['ЦЕЛЕВЫЕ ДЕЙСТВИЯ','126','↑ 12,5%','настроенная цель']],rows:[['Одна ошибка за 15 секунд','Объяснение','82 430','68%','426','39'],['До / после','Трансформация','61 200','61%','311','28'],['Три быстрых совета','Подборка','38 140','47%','109','7']]},
  30:{metrics:[['ПРОСМОТРЫ','1 042 380','↑ 23,1%','к прошлому периоду'],['СР. ВРЕМЯ ПРОСМОТРА','11,9 сек','↑ 0,8 сек','к прошлому периоду'],['ПЕРЕХОДЫ','5 240','↑ 14,8%','атрибутировано'],['ЦЕЛЕВЫЕ ДЕЙСТВИЯ','438','↑ 16,2%','настроенная цель']],rows:[['Одна ошибка за 15 секунд','Объяснение','182 430','65%','926','82'],['До / после','Трансформация','141 200','59%','711','64'],['Три быстрых совета','Подборка','98 140','49%','309','24']]}
};
const metrics = document.querySelector('#metrics');
const rows = document.querySelector('#publication-rows');
function renderPeriod(period){
  const current=data[period];
  metrics.innerHTML=current.metrics.map((m,i)=>`<div class="metric"><div class="metric-label">${m[0]} <span>0${i+1}</span></div><div class="metric-value">${m[1]}</div><div class="metric-bottom"><b>${m[2]}</b>${m[3]}</div></div>`).join('');
  rows.innerHTML=current.rows.map(r=>`<tr><td><b>${r[0]}</b><small>${r[1]} · Instagram</small></td>${r.slice(2).map(v=>`<td>${v}</td>`).join('')}</tr>`).join('');
}
document.querySelectorAll('[data-period]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-period]').forEach(b=>b.classList.toggle('selected',b===button));renderPeriod(button.dataset.period)}));
const taskData=[['▤','Видео на проверке','2 ролика ожидают решения','Производство'],['!','Сбой публикации','Нет связи с аккаунтом · 09:14','Интеграции'],['◇','Эксперимент завершён','Хук A / B · посмотреть результат','Эксперименты']];
document.querySelector('#tasks').innerHTML=taskData.map((t,i)=>`<div class="task"><span class="task-icon ${i===1?'warn':''}">${t[0]}</span><div class="task-text"><b>${t[1]}</b><small>${t[2]}</small></div><button data-go="${t[3]}" aria-label="Открыть: ${t[1]}">↗</button></div>`).join('');
const descriptions={'Референсы':'Здесь появится библиотека примеров и разборов форматов.','Производство':'Здесь будут идеи, сценарии и ролики на разных этапах производства.','Публикации':'Здесь появятся календарь и очередь публикаций после подключения аккаунта.','Эксперименты':'Здесь будут сравнения вариантов роликов и результаты тестов.','Аналитика':'Подключите площадки и настройте целевые действия, чтобы собирать результаты.','Интеграции':'Аккаунты и источники аналитики пока не подключены. Подключение будет доступно после настройки серверной части.'};
function getIdeas(){try{return JSON.parse(localStorage.getItem('factory-ideas')||'[]')}catch{return []}}
function navigate(section){
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.section===section));
  document.querySelector('#crumb').textContent=section.toUpperCase();
  document.querySelector('#overview').hidden=section!=='Обзор';
  const view=document.querySelector('#section-view'); view.hidden=section==='Обзор';
  if(section==='Обзор')return;
  view.replaceChildren();
  const title=document.createElement('h1');title.textContent=section;view.append(title);
  const panel=document.createElement('div');panel.className='empty-panel';
  const text=document.createElement('p');text.textContent=descriptions[section];panel.append(text);
  if(section==='Производство')getIdeas().forEach(idea=>{const item=document.createElement('div');item.className='idea-item';const name=document.createElement('b');name.textContent=idea.title;const description=document.createElement('small');description.textContent=idea.description||'Новая идея';item.append(name,description);panel.append(item)});
  view.append(panel);
}
document.addEventListener('click',e=>{const target=e.target.closest('[data-section],[data-go]');if(target)navigate(target.dataset.section||target.dataset.go)});
const dialog=document.querySelector('#idea-dialog');document.querySelector('#new-idea').addEventListener('click',()=>dialog.showModal());dialog.querySelectorAll('.close').forEach(b=>b.addEventListener('click',()=>dialog.close()));
document.querySelector('#idea-form').addEventListener('submit',e=>{e.preventDefault();const ideas=getIdeas();ideas.unshift({title:document.querySelector('#idea-title').value.trim(),description:document.querySelector('#idea-description').value.trim()});try{localStorage.setItem('factory-ideas',JSON.stringify(ideas));dialog.close();e.target.reset();showToast('Идея сохранена в этом браузере');}catch{showToast('Не удалось сохранить идею в браузере')}});
let toastTimer;function showToast(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3000)}
document.querySelector('#refresh').addEventListener('click',()=>showToast('Показаны демонстрационные данные'));
function clock(){document.querySelector('#clock').textContent=new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit'}).format(new Date())+' МСК'}clock();setInterval(clock,30000);renderPeriod(7);
