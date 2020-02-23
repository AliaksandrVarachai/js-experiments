const navigationToolbar = document.getElementsByClassName('navigation-toolbar')[0];
// const navigationItems = document.getElementsByClassName('navigation-item');
const navigationItems = document.querySelectorAll('input[name="pages"]');
const contentPages = document.getElementsByClassName('page-content');

function showPage(contentPage) {
  for (let i = 0; i < contentPages.length; i++) {
    const cp = contentPages[i];
    if (cp === contentPage) {
      cp.classList.remove('hidden');
    } else {
      cp.classList.add('hidden');
    }
  }
}

navigationToolbar.addEventListener('click', function(event) {
  const target = event.target;
  console.log('target=', target)
  if (target.type !== 'radio') {
    return;
  }
  let pageId;
  for (let i = 0; i < navigationItems.length; i++) {
    console.log(navigationItems[i]);
    if (target === navigationItems[i]) {
      pageId = target.getAttribute('page-id');
      break;
    }
  }
  history.pushState({pageId: 1}, 'Page 1', pageId);
  showPage(document.getElementById(pageId));
}, false);
