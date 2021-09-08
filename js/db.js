// offline data
db.enablePersistence()
  .catch(err => {
      if(err.code == 'failed-precondition'){
        //   probably multiple tabs open at once
          console.log('persistence failed');
      } else if(err.code == 'unimplemented'){
          console.log('persistence is not avaliable');
      }
  });


  const devices = document.querySelector('.devices');
  const main=document.querySelector('.main-conatiner');
// real-time listener
db.collection('amazon-devices').onSnapshot((snapshot)=>{
 
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        // console.log(change,change.doc.data(), change.doc.id);
        
        if(change.type === 'added'){
          if(snapshot.size>0){
            const html=`<div class="source-title" data-id="${change.doc.id}">Amazon</div>`;
            devices.innerHTML+=html;
          }
            // add the document data to the web pag
            renderDevice(change.doc.data(),change.doc.id);
        }
        if(change.type === 'removed'){
            // remove the document data from the web page
            removeDevice(change.doc.id);
        }
    });
});



// real-time listener
db.collection('flipkart-devices').onSnapshot((snapshot)=>{
 
  // console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
      // console.log(change,change.doc.data(), change.doc.id);
      if(change.type === 'added'){
        if(snapshot.size>0){
          const html=`<div class="source-title" data-id="${change.doc.id}">Flipkart</div>`;
          devices.innerHTML+=html;
        }
          // add the document data to the web page
          renderDevice(change.doc.data(),change.doc.id);
      }
      if(change.type === 'removed'){
          // remove the document data from the web page
          removeDevice(change.doc.id);
      }
  });
});


// Render device data
const renderDevice = (data,id) => {
  if(data.price==0){
    data.price="Price not available";
  }else{
    if(typeof data.source == "string" && data.source =="Flipkart"){
      data.price=data.price;
    }else{
    data.price= `<i class="fa fa-rupee rupee-sign"></i>${data.price}`
    }
  }

 
  const html = `<div class="card-panel device white row" data-id="${id}">
  <img src="${data.imgSrc}" alt="device thumb" class="device-image">
  <div class="device-details">
   <a target="_blank" href="${data.link}" class="device-link"> <div class="device-title">${data.title}</div></a>
    <div>
<span class="device-price">${data.price}</span>
    </div>
  </div>
  <div class="device-delete">
    <i class="material-icons delete-icon" data-id="${id}" data-source="${data.source}">delete_outline</i>
  </div>
</div>`;

devices.innerHTML += html;
};





  const removeDevice = (id) => {
    let device = document.querySelector(`.device[data-id=${id}]`);
    device.remove();
    let title = document.querySelector(`.source-title[data-id=${id}]`);
    title.remove();
 
  };



// add new device
const form = document.querySelector('form');
form.addEventListener('submit',evt => {
    evt.preventDefault();
    scrape().then(function(devices) {
        // Run this when your request was successful
        console.log(devices);
        devices.forEach(device=>{
          if(device.source!=null && device.source == "Amazon"){
                           db.collection('amazon-devices').add(device)
                           .catch(err => console.log(err));
          }else if(device.source!=null && device.source == "Flipkart"){
            db.collection('flipkart-devices').add(device)
            .catch(err => console.log(err));
          }
                       });
      }).catch(function(err) {
        // Run this when promise was rejected via reject()
        error();
        console.log(err)
      })
    form.title.value = '';
});

// delete a device
const deviceContainer = document.querySelector('.devices');
deviceContainer.addEventListener('click',evt => {
    // console.log(evt);
    if(evt.target.tagName === 'I'){
      const source=evt.target.getAttribute('data-source');
      if(source!=null){
        if(source == "Amazon"){
        const id = evt.target.getAttribute('data-id');
        db.collection('amazon-devices').doc(id).delete();
        }else if(source == "Flipkart"){
          const id = evt.target.getAttribute('data-id');
          db.collection('flipkart-devices').doc(id).delete();
        }
      }
    }
});

function scrape() {
    return new Promise(function(resolve, reject) {
      $.ajax({ //it is asynchronous so we have used promise
        type: 'POST',
        url: "http://127.0.0.1:3000/scrape/",
        data: JSON.stringify({"item_id":form.title.value}),
        contentType: 'application/json; charset=utf-8',
        success: function(data){
             resolve(data) // this calls then()
        },
        error: function(err) {
          reject(err)//this calls catch()
        }
});
    });

  }