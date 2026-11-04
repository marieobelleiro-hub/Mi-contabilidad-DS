# Builds app_LOCAL.html from the current app_DEMO.html (same design system, same data),
# adding the Local features of the old app_TRUE: Guardar copia .html · Exportar / Importar .json ·
# Autorizar edición · Guardado / Guardar cambios (File System Access API, saves into the .html file).
# The two Local dialogs use the design-system <dialog>.
import re, sys
import os
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', '..', 'app', 'app_DEMO.html')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(SRC), 'app_LOCAL.html')
s = open(SRC, encoding='utf-8').read()

def rep(old, new, count=1):
    global s
    if old not in s:
        sys.exit(f'NOT FOUND: {old[:90]}')
    s = s.replace(old, new, count)

ARROW = '<svg class="icon icon--md" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M9 3L8.285 3.697L12.075 7.5H2V8.5H12.075L8.285 12.287L9 13L14 8Z"/></svg>'
DOWNLOAD = '<svg class="icon icon--md" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M7.5 2h1v7.585l2.795-2.79.705.705L8 11.5l-4-4 .705-.705L7.5 9.585zM3 13h10v1H3z"/></svg>'
SAVE = '<svg class="icon icon--md" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><use href="#ico-save"/></svg>'

# 1 · Title
s = re.sub(r'<title>[^<]*</title>', '<title>Contabilidad LOCAL</title>', s, count=1)

# 2 · Welcome: the Local text (desktop and mobile bodies)
P1 = ('Esta es una pequeña aplicación diseñada para ayudar a los autónomos de España a organizar su contabilidad con la normativa vigente en ese momento*.',
      'This is a small app designed to help Freelancers based in Spain organise their accounting according to the rules in force at the time*.')
P2 = ("Por ahora, es una aplicación local que puedes editar mediante un archivo HTML independiente en tu dispositivo. Para iniciar el proceso de registro de datos, primero debes descargar el archivo HTML (botón pequeño en la parte superior de la página). A continuación, haz clic en el botón 'Autorizar edición' (arriba a la derecha) y sigue las instrucciones.",
      "For now, it is a local app that you can edit using a separate HTML file on your device. To start the data recording process, you must first download the HTML file (small button at the top of the page). Then, click the 'Autorizar edición' button (top right) and follow the instructions.")
P3es = "*&lt;strong&gt;Importante:&lt;/strong&gt; Esta app es una demo para el portfolio de Marie Obelleiro (no es un producto profesional ni certificado). &lt;u&gt;Si decides usarla para tu contabilidad es bajo tu entera responsabilidad.&lt;/u&gt;"
P3en = "*&lt;strong&gt;Important:&lt;/strong&gt; This app is a demo for Marie Obelleiro's portfolio (it is not a professional or certified product). &lt;u&gt;If you decide to use it for your own accounting, it is entirely at your own responsibility.&lt;/u&gt;"
P3html = "*<strong>Importante:</strong> Esta app es una demo para el portfolio de Marie Obelleiro (no es un producto profesional ni certificado). <u>Si decides usarla para tu contabilidad es bajo tu entera responsabilidad.</u>"
body = (f'<p data-es="{P1[0]}" data-en="{P1[1]}">{P1[0]}</p>\n      <p data-es="{P2[0]}" data-en="{P2[1]}">{P2[0]}</p>\n'
        f'      <p data-es-html="{P3es}" data-en-html="{P3en}">{P3html}</p>\n    ')
a = s.index('<div class="welcome-overlay" id="welcome-overlay">')
b = s.index('<div class="welcome-actions"', a)
block = s[a:b]
block = re.sub(r'data-es="Bienvenidos a Contabilidad Demo" data-en="Welcome to the Contabilidad Demo">Bienvenidos a Contabilidad Demo',
               'data-es="Contabilidad LOCAL" data-en="Contabilidad LOCAL">Contabilidad LOCAL', block)
block = re.sub(r'(<div class="welcome-body">).*?(</div>)', lambda m: m.group(1) + '\n      ' + body + m.group(2), block, count=1, flags=re.S)
block = re.sub(r'(<div class="welcome-body-mob">).*?(</div>)', lambda m: m.group(1) + '\n      ' + body + m.group(2), block, count=1, flags=re.S)
s = s[:a] + block + s[b:]

# 3 · Header: LOCAL label, its explanation, the file buttons and the save button
rep('<span class="user-vat">DEMO</span>', '<span class="user-vat">LOCAL</span>')
LOCAL_TIP = ("&lt;p&gt;Esta app ha sido concebida para ayudar a organizar la contabilidad de trabajadores autónomos en España. Funciona en local lo cual significa que los datos que insertes no estarán online.&lt;/p&gt;"
             "&lt;p&gt;Para usarla tienes que guardar una copia html en tu disco duro y abrirla en Chrome.&lt;/p&gt;"
             "&lt;p&gt;Para empezar a hacerla tuya, haz click en el botón azul ‘Autorizar edición’, selecciona la copia del archivo html y cambia lo que quieras. Todo lo que se escriba después de guardar cambios residirá en ese archivo, será tu contabilidad y podrás repetir la operación todas las veces que desees.&lt;/p&gt;"
             "&lt;p&gt;Recomendamos hacer una copia de los datos en formato .json para volver a importarlos en caso de necesitarlo, o como control de versiones.&lt;/p&gt;")
s = re.sub(r"(<span class=\"user-vat\">LOCAL</span>\s*<button class=\"btn btn--icon btn--sm btn--info gst-info-btn\" onmouseenter=\"showTooltip\(this,')[^']*(')",
           lambda m: m.group(1) + LOCAL_TIP + m.group(2), s, count=1)
TOOLS = f'''
      <div class="topbar-actions">
        <button type="button" class="btn btn--ghost btn--primary" onclick="abrirModalGuardar()"><span class="btn__label">Guardar copia .html</span></button>
        <button type="button" class="btn btn--ghost btn--primary" onclick="guardarJSON()"><span class="btn__label">Exportar .json</span></button>
        <button type="button" class="btn btn--ghost btn--primary" onclick="document.getElementById('file-import').click()"><span class="btn__label">Importar .json</span></button>
        <input type="file" id="file-import" accept=".json" onchange="importarDatos(this)" hidden>
      </div>
      <div class="topbar-cta">
        <button type="button" class="btn btn--primary" id="btn-autorizar" onclick="openAuthDialog()"><span class="btn__label">Autorizar edición</span>{ARROW}</button>
        <button type="button" class="btn btn--primary" id="btn-guardar" onclick="guardarEnArchivo()" hidden><span class="btn__label">Guardado</span>{SAVE}</button>
      </div>
      <div class="m-nav tab-menu">'''
rep('\n      <div class="m-nav tab-menu">', TOOLS)

# 4 · The two Local dialogs, as design-system <dialog>s
DIALOGS = f'''
<!-- Local: instructions before choosing the file (opens with "Autorizar edición") -->
<dialog class="dialog dialog--md" id="auth-dialog" aria-labelledby="auth-title">
  <div class="dialog__header"><h2 class="dialog__title" id="auth-title">Instrucciones para la app local</h2></div>
  <div class="dialog__body">
    <p>Seleccione en su ordenador el archivo .html de la app previamente descargado (botón "Guardar copia .html") a fin de comenzar la edición.</p>
    <p>Recomendamos hacer una copia de los datos en formato .json para volver a importarlos en caso de necesitarlo, o como control de versiones.</p>
  </div>
  <div class="dialog__actions dialog__actions--split">
    <button type="button" class="btn btn--ghost btn--primary" onclick="closeAuthDialog()"><span class="btn__label">Cancelar</span></button>
    <button type="button" class="btn btn--primary" onclick="confirmAuthDialog()"><span class="btn__label">Continuar</span>{ARROW}</button>
  </div>
</dialog>
<!-- Local: Guardar copia .html (with or without data) -->
<dialog class="dialog dialog--md" id="modal-guardar" aria-labelledby="guardar-title">
  <div class="dialog__header"><h2 class="dialog__title" id="guardar-title">Guardar copia .html</h2></div>
  <div class="dialog__body">
    <p>Elige qué versión quieres descargar.</p>
    <fieldset class="choice-group"><legend class="sr-only">Versión</legend>
      <label class="choice"><input type="radio" name="guardar-version" value="actual" checked><span class="choice__text"><b class="choice__title">Versión actual (con datos)</b><span class="choice__desc">Guarda la contabilidad registrada actual.</span></span></label>
      <label class="choice"><input type="radio" name="guardar-version" value="vacia"><span class="choice__text"><b class="choice__title">Versión vacía (sin datos)</b><span class="choice__desc">Para empezar desde cero.</span></span></label>
    </fieldset>
  </div>
  <div class="dialog__actions dialog__actions--split">
    <button type="button" class="btn btn--ghost btn--primary" onclick="cerrarModalGuardar()"><span class="btn__label">Cancelar</span></button>
    <button type="button" class="btn btn--primary" onclick="ejecutarGuardarCopia()"><span class="btn__label">Descargar</span>{DOWNLOAD}</button>
  </div>
</dialog>
<div class="page">'''
rep('\n<div class="page">', DIALOGS)

# 5 · CSS: place the Local buttons in the top bar (desktop only, as before)
CSS = '''
/* LOCAL: file buttons and save button in the top bar (desktop only) */
.topbar-actions{display:flex;align-items:center;gap:var(--space-16);margin-left:auto}
.topbar-cta{display:flex;align-items:center;margin-left:var(--space-24)}
.topbar-cta [hidden]{display:none !important}
@media (max-width:1023px){.topbar-actions,.topbar-cta{display:none !important}}
</style>'''
i = s.rindex('</style>', 0, s.index('<body'))
s = s[:i] + CSS + s[i + len('</style>'):]

# 6 · Data changes mark the file as "to save"
rep("function saveState(s){__appData['yr_'+activeYear]=fixRetaIva(s);}", "function saveState(s){__appData['yr_'+activeYear]=fixRetaIva(s);markChanged();}")

# 7 · Accessibility assistant: the note about saving, and its "Autorizar edición" link
rep("  demo:'Ejemplo online: los cambios se ven en la app; al recargar la página vuelven los datos de ejemplo.',",
    "  demo:'Modo demo: los cambios se ven en la app pero no se guardan en el archivo. Para guardarlos, pulsa «Autorizar edición».',\n  authBtn:'Autorizar edición',saved:'Los cambios se guardarán cuando pulses «Guardar cambios».',")
rep("  demo:'Online example: your changes show up in the app; reloading the page brings back the example data.',",
    "  demo:'Demo mode: your changes show up in the app but are not saved to the file. To save them, use “Autorizar edición” (authorise editing).',\n  authBtn:'Authorise editing',saved:'Changes will be written to the file when you press “Guardar cambios” (save changes).',")
rep("const demoNote=()=>`<p class=\"af-note\">${h(L('demo'))}</p>`;",
    """const demoNote=()=>{
  if(typeof __fileHandle!=='undefined'&&__fileHandle)return `<p class="af-note">${h(L('saved'))}</p>`;
  if(!window.showOpenFilePicker)return `<p class="af-note">${h(L('demo').replace(/ (Para guardarlos|To save them).*$/,''))}</p>`;
  return `<div class="af-note"><p>${h(L('demo'))}</p><button type="button" class="af-link" data-k="auth">${h(L('authBtn'))}</button></div>`;
};""")
rep("  if(k==='restart'){S.a=S.c=S.s=null;render({sel:'button[data-k=\"a\"]'});return;}",
    "  if(k==='restart'){S.a=S.c=S.s=null;render({sel:'button[data-k=\"a\"]'});return;}\n  if(k==='auth'){openAuthDialog();return;}")

# 8 · The Local functions (file copy, open, save, JSON export / import, change tracking)
JS = r'''
// ═══ LOCAL: save the data inside the .html file (File System Access API) ═══
// The data lives in `let __appData = {…};` in this file. Saving rewrites that line.
function __withData(src,data){
  const marker='let __appData = ';const si=src.indexOf(marker);
  if(si===-1){alert('Error: marcador no encontrado.');return null;}
  const afterM=si+marker.length;
  let depth=0,pos=afterM,inStr=false,esc2=false;
  for(;pos<src.length;pos++){
    const c=src[pos];
    if(esc2){esc2=false;continue;}
    if(c==='\\'&&inStr){esc2=true;continue;}
    if(c==='"'&&!esc2)inStr=!inStr;
    if(!inStr){if(c==='{'||c==='[')depth++;else if(c==='}'||c===']'){depth--;if(depth===0){pos++;break;}}}
  }
  return src.slice(0,afterM)+JSON.stringify(data)+';'+src.slice(pos+1);
}
function __readData(text){
  const marker='let __appData = ';const si=text.indexOf(marker);if(si===-1)return null;
  const afterM=si+marker.length;let depth=0,pos=afterM,inStr=false,esc2=false;
  for(;pos<text.length;pos++){
    const c=text[pos];
    if(esc2){esc2=false;continue;}
    if(c==='\\'&&inStr){esc2=true;continue;}
    if(c==='"'&&!esc2)inStr=!inStr;
    if(!inStr){if(c==='{'||c==='[')depth++;else if(c==='}'||c===']'){depth--;if(depth===0){pos++;break;}}}
  }
  try{return JSON.parse(text.slice(afterM,pos));}catch(e){return null;}
}
function __download(content,name,type){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type}));
  a.download=name;a.click();URL.revokeObjectURL(a.href);
}
// Guardar copia .html (dialog: with the current data, or empty)
function abrirModalGuardar(){
  const d=document.getElementById('modal-guardar');
  const def=d.querySelector('input[value="actual"]');if(def)def.checked=true;
  d.showModal();
}
function cerrarModalGuardar(){const d=document.getElementById('modal-guardar');if(d.open)d.close();}
function ejecutarGuardarCopia(){
  const sel=document.querySelector('#modal-guardar input[name="guardar-version"]:checked');if(!sel)return;
  if(sel.value==='actual'){const src=__withData(__originalSrc,__appData);if(src)__download(src,'contabilidad_'+activeYear+'.html','text/html;charset=utf-8');}
  else{const src=__withData(__originalSrc,{_years:[new Date().getFullYear()]});if(src)__download(src,'contabilidad_nueva.html','text/html;charset=utf-8');}
  cerrarModalGuardar();
}
// Autorizar edición: instructions, then choose the .html file on the computer
function openAuthDialog(){document.getElementById('auth-dialog').showModal();}
function closeAuthDialog(){const d=document.getElementById('auth-dialog');if(d.open)d.close();}
function confirmAuthDialog(){closeAuthDialog();abrirArchivo();}
async function abrirArchivo(){
  if(!window.showOpenFilePicker){alert('Tu navegador no soporta esta función. Usa Chrome 86+.');return;}
  try{
    const [handle]=await window.showOpenFilePicker({types:[{description:'HTML',accept:{'text/html':['.html']}}]});
    __fileHandle=handle;
    const text=await (await handle.getFile()).text();
    const data=__readData(text);
    if(data){
      __appData=data;
      if(!__appData._years)__appData._years=getAllYears();
      getAllYears().forEach(y=>fixRetaIva(__appData['yr_'+y]));
      activeYear=getAllYears().slice(-1)[0];
      renderYearStrip();renderAll();
    }
    document.getElementById('btn-autorizar').hidden=true;
    const g=document.getElementById('btn-guardar');g.hidden=false;markSaved();
  }catch(e){if(e.name!=='AbortError')alert('Error al abrir: '+e.message);}
}
async function guardarEnArchivo(){
  if(!__fileHandle){alert('Primero abre el archivo con "Autorizar edición".');return;}
  try{
    const src=__withData(__originalSrc,__appData);if(!src)return;
    const w=await __fileHandle.createWritable();await w.write(src);await w.close();
    __originalSrc=src;markSaved();
  }catch(e){alert('Error al guardar: '+e.message);}
}
// Exportar / Importar .json (a copy of the data, e.g. as version control)
function guardarJSON(){
  const years=getAllYears();
  const backup={version:1,fecha:new Date().toISOString(),years};
  years.forEach(yr=>{if(__appData['yr_'+yr])backup['cb_'+yr]=__appData['yr_'+yr];});
  __download(JSON.stringify(backup,null,2),'contabilidad_backup_'+new Date().toISOString().slice(0,10)+'.json','application/json');
}
function importarDatos(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const backup=JSON.parse(e.target.result);
      if(backup.version&&backup.years){
        __appData={_years:backup.years};
        backup.years.forEach(yr=>{if(backup['cb_'+yr])__appData['yr_'+yr]=backup['cb_'+yr];});
        activeYear=backup.years[backup.years.length-1];
      }else if(backup.facturas||backup.gastos){
        __appData={_years:[activeYear]};__appData['yr_'+activeYear]=backup;
      }else{alert('Formato no reconocido.');return;}
      getAllYears().forEach(y=>fixRetaIva(__appData['yr_'+y]));
      renderYearStrip();renderAll();markChanged();
      alert('✓ Datos importados. Guarda el archivo para conservarlos.');
    }catch(err){alert('Error: '+err.message);}
    input.value='';
  };
  reader.readAsText(file);
}
// Change tracking: "Guardado" (blue) → "Guardar cambios" (orange) after any change
let __hasChanges=false;
let __fileHandle=null;
function markChanged(){
  if(!__fileHandle)return;
  __hasChanges=true;
  const b=document.getElementById('btn-guardar');
  if(b){b.classList.replace('btn--primary','btn--attention');b.querySelector('.btn__label').textContent='Guardar cambios';}
}
function markSaved(){
  __hasChanges=false;
  const b=document.getElementById('btn-guardar');
  if(b){b.classList.replace('btn--attention','btn--primary');b.querySelector('.btn__label').textContent='Guardado';}
}
window.addEventListener('beforeunload',e=>{
  if(__hasChanges){e.preventDefault();e.returnValue='Tienes cambios sin guardar. ¿Seguro que quieres salir?';return e.returnValue;}
});
'''
rep('// ─── Init ─', JS + '\n// ─── Init ─')
# the untouched source of this file, used when saving (captured before anything renders)
rep("if(!__appData._years)__appData._years=getAllYears();\ngetAllYears().forEach(y=>fixRetaIva(__appData['yr_'+y]));\nrenderYearStrip();",
    "let __originalSrc='<!DOCTYPE html>\\n'+document.documentElement.outerHTML;\nif(!__appData._years)__appData._years=getAllYears();\ngetAllYears().forEach(y=>fixRetaIva(__appData['yr_'+y]));\nrenderYearStrip();")

open(OUT, 'w', encoding='utf-8').write(s)
print('app_LOCAL.html', len(s))
