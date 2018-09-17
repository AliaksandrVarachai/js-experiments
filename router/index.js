const navigationToolbar = document.getElementsByClassName('navigation-toolbar')[0];
const navigationItems = document.getElementsByClassName('navigation-item');
const contentPages = document.getElementsByClassName('page-content');

function showPage(contentPage) {
  for (let i = 0; i < contentPages.length; i++) {
    const cp = contentPages[i];
    if (cp === contentPage) {
      cp.classList.add('visible');
    } else {
      cp.classList.remove('visible');
    }
  }
}

navigationToolbar.addEventListener('click', function(event) {
  const target = event.target;
  if (target.type !== 'radio') {
    console.log('adfsf=', target);
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
  console.log('pageId=', pageId);
  showPage(document.getElementById(pageId));
}, false);
