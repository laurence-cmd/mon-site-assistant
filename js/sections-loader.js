/* Synergies Humaines : contenu complementaire editable dans Decap */
(function(){
  const page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/,'');
  if(!['index','atomat','gestion','web','apropos','mentions'].includes(page)) return;
  fetch('/content/'+page+'_sections.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('content not found');return r.json()}).then(data=>{
    document.querySelectorAll('[data-cms-text]').forEach(el=>{
      const val=data[el.dataset.cmsText];
      if(typeof val!=='string')return;
      const node=Array.from(el.childNodes).find(n=>n.nodeType===3&&n.textContent.trim());
      if(node)node.textContent=val;
    });
    document.querySelectorAll('[data-cms-image]').forEach(el=>{
      const val=data[el.dataset.cmsImage];if(typeof val==='string'&&val)el.setAttribute('src',val);
    });
  }).catch(err=>console.warn('Contenu Decap complementaire non charge:',err));
})();
