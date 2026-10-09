export function emailDraftUrl(recipient,name,email,message){
 const subject=`Portfolio inquiry from ${name.trim()}`;
 const body=`${message.trim()}\n\n${name.trim()}\nReply to: ${email.trim()}`;
 return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
if(typeof document!=='undefined'){
 document.querySelectorAll('.email-compose').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  window.location.href=emailDraftUrl(form.dataset.recipient,data.get('name'),data.get('email'),data.get('message'));
 }));
}
