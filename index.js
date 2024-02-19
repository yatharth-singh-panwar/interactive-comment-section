//Make the send button interactive
//ON clicking send, Add the particular tweet on in the data.json for that user. 
// Display all the tweets using the generate html feature according to the number of likes.
//2 areas to call the each new function one is line 14 , and teh second one is line is  send button.
//fetching the data.json file
let datafile;

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Data is now a JavaScript object
    datafile = data;
      generateHTML(datafile);
      sendButton();
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

//function that generates the html from the given data.js.
function generateHTML(datafile){
  
  const comment = document.querySelector('body');
  comment.innerHTML =`
  <br>
  <div class="ReplyBox comment-box-container sendMessageBox">

    <div class="profile-new">
      <img src="images/avatars/image-juliusomo.png" alt="profile-picture" height="35px">
    </div>

    <div class="Text-Area js-new-comment">
      <textarea rows="4" cols="55"></textarea>
    </div>

    <div class="Send-Button js-new-send-button">
      <button>Send</button>
    </div>
  </div>
  `;
  datafile[0].comments.forEach((element, index) => {
    //generate the HTML for the particular comment.
    const id = element.id;
    const userName = element.user.username;
    const time = element.createdAt;
    const vote = element.score;
    const text = element.content;

    comment.innerHTML +=
    `
    <div class = "comment-box-container js-commentt-${id}">
      <div class = "upvote-downvote">
        <div class="plus js-plus-${element.id}"><img src="images/icon-plus.svg"></div>
        <div class="vote-number">${vote}</div>
        <div class="minus js-minus-${element.id}"><img src="images/icon-minus.svg"></div>
      </div>
      <div class = "comment-content">
        <div class="profileAndReply">
          <div class="profile">
            <img src="images/avatars/image-${userName}.png" alt="profile-picture" height="30px">
          </div>
          <div class="name">${userName}</div>
          <div class="time">${time}</div>
          <div class="reply js-reply-out-${id}">
            <img src="images/icon-reply.svg" alt="reply image"><p><a>Reply</a></p>
          </div>
        </div>
        <div class="text">
          <p>
            ${text}
          </p>
        </div>
      </div>
    </div>
    `
    if(element.replies.length > 0){
      //generate the html for the replies.
      const replyContainerDiv = document.createElement('div');
      replyContainerDiv.classList.add('reply-container-box', `js-thread-comment-${index}`);
      document.querySelector(`.js-commentt-${id}`).insertAdjacentElement('afterend', replyContainerDiv);
      const lineHTML = document.querySelector(`.js-thread-comment-${index}`);
      lineHTML.innerHTML = `
      <div class="line js-line-${index}">
      `
      const replyContainerDiv2 = document.createElement('div');
      replyContainerDiv2.classList.add('reply-container', `js-reply-container-${index}`);
      document.querySelector(`.js-line-${index}`).insertAdjacentElement('afterend',replyContainerDiv2);

      element.replies.forEach(reply => {
        const reply_container = document.querySelector(`.js-reply-container-${index}`);
        const replyVoteNumber = reply.score;  
        const replyUserName = reply.user.username;
        const replyDate = reply.createdAt;
        const replycontent = reply.content;

        if(reply.user.username != datafile[0].currentUser.username){
          reply_container.innerHTML +=`
          
          <div class="comment-replymsg-container comment-box-container js-reply-id-${reply.id}">
            <div class = "upvote-downvote">
        
              <div class="plus js-plus-${reply.id}"><img src="images/icon-plus.svg"></div>
              <div class="vote-number">${replyVoteNumber}</div>
              <div class="minus js-minus-${reply.id}"><img src="images/icon-minus.svg"></div>
        
            </div>
            <div class = "comment-content">
              <div class="profileAndReply">
                <div class="profile">
                  <img src="images/avatars/image-${replyUserName}.png" alt="profile-picture" height="30px">
                </div>
                <div class="name">${replyUserName}</div>
                <div class="time">${replyDate}</div>
                <div class="reply js-reply-in-${reply.id}">
                  <img src="images/icon-reply.svg" alt="reply image"><p><a>Reply</a></p>
                </div>
              </div>
              <div class="text">
                <p>
                ${replycontent}
                </p>
              </div>
            </div>
          </div>
          `
        }

        else{
          reply_container.innerHTML += `
          <div class="comment-editmsg-container comment-box-container js-reply-id-${reply.id}">
            <div class="profileInformation">
              <div class = "upvote-downvote">
                <div class="plus js-plus-${reply.id}"><img src="images/icon-plus.svg"></div>
                <div class="vote-number">${replyVoteNumber}</div>
                <div class="minus js-minus-${reply.id}"><img src="images/icon-minus.svg"></div>
              </div>
              <div class="profileAndReply">
                <div class="profile">
                  <img src="images/avatars/image-${replyUserName}.png" alt="profile-picture" height="30px">
                </div>
                <div class="name">${replyUserName}</div>
                <div class="self-comment name">
                  you
                </div>
                <div class="time">${replyDate}</div>
                <div class="reply">
                  <button class="delete js-Delete-Id-${reply.id}"><img src="images/icon-delete.svg"> Delete</button>
                  <button class="edit"><img src="images/icon-edit.svg"> Edit</button>
                </div>  
              </div>
            </div>
            <div class="edit-text">
              <div class="text">
                <p>
                  ${replycontent}
                </p>
              </div>
            </div>
          </div>
          `
        }       
      });
    }
    datafile[0].comments.forEach((element) => {
      const id = element.id;
      const username = element.user.username;
      replyButtonsOut(id, username);
      if(element.replies.length > 0){
        element.replies.forEach((reply) =>{
          replyInside(reply.id, username, id);
        });
      }
    });

    datafile[0].comments.forEach((element) => {
      if(element.replies.length > 0){
        element.replies.forEach((reply) =>{ 
          if(reply.user.username === datafile[0].currentUser.username){
            deleteButton(reply.id, element.id);
          }
        }); 
      }
    });

    datafile[0].comments.forEach(comment =>{
      upVoteDownVote(comment.id);
      if(comment.replies.length > 0){
        comment.replies.forEach(reply=>{
          upVoteDownVote(reply.id);
        })
      }
    })
  })
}
//function that first saves the given text to the file.json and then regenrates the html.
function sendButton (){
  const cSendButton = document.querySelector(".js-new-send-button");
  cSendButton.addEventListener('click',()=>{
      const celement= document.querySelector('.js-new-comment textarea');
      const element = celement.value;
      //calculate the heighest id of the given sequence.
      let id = 0;
      datafile[0].comments.forEach(element => {
        if(id < element.id){
          id = element.id;
        }
        if(element.replies.length > 0){
          element.replies.forEach(reply => {
          if(id < reply.id){
            id = reply.id;
          }
          })
        }
      });
      datafile[0].comments.push(
        {
          "id": id+1,
          "content": element,
          "createdAt": "1 month ago",
          "score": 0,
          "user": {
            "image": { 
              "png": "./images/avatars/image-juliusomo.png",
              "webp": "./images/avatars/image-juliusomo.webp"
            },
            "username": "juliusomo"
          },
          "replies": []
        },
      )
    generateHTML(datafile);
    sendButton();
  })
}


//function that takes the replies options and then replies to the generate HTML funciton.
//make 2 diffrent inside functions for in and out rpely and then add the replies to the respective comments in datafile
//and then regenerate HTML on clicking the html send button for the reply.


// things to consider{
//   only allow 1 user to get 1 reply box on clicking the box 
//   enter the deails of the current user in the box 
// }

function replyButtonsOut(id, username){
  //get all the reply-out-buttons
  //new js class needs to be added to the out ones.
  const replyButtons = document.querySelectorAll(`.js-reply-out-${id} a`);
  replyButtons.forEach(button => {
    button.addEventListener('click', ()=>{
      //generate the html for the replybox;

      //information for the data.json file.
      const currentUser = datafile[0].currentUser.username;

      const creplybox = document.querySelector(`.js-commentt-${id}`);
      const nreplybox = document.createElement('div');
      nreplybox.classList.add('ReplyBox','comment-box-container');
      nreplybox.innerHTML += `
      <div class="profile-new">
        <img src="images/avatars/image-${currentUser}.png" alt="profile-picture" height="35px">
      </div>

      <div class="Text-Area js-textArea-${button}">
        <textarea rows="4" cols="55">@${username}  </textarea>
      </div>
      

      <div class="Send-Button js-replyButton-${button}">
        <button>Reply</button>
      </div>
      `
      creplybox.insertAdjacentElement('afterend',nreplybox);

      
      const cSendButton = document.querySelector(`.js-replyButton-${button}`);
      cSendButton.addEventListener('click', ()=>{
        const text = document.querySelector(`.js-textArea-${button} textarea`).value;
        const currentusername = datafile[0].currentUser.username;
        const time = "1 month ago";

        //append this to the file and then regenerate the HTML

        //calculate the heigheset number of the given sequence and add 1 to it.
        let idOfnewmsg = 0;
        datafile[0].comments.forEach(element => {
          if(idOfnewmsg <= element.id){
            idOfnewmsg = element.id+1;
          }
          if(element.replies.length > 0){
            element.replies.forEach(reply => {
            if(idOfnewmsg <= reply.id){
              idOfnewmsg = reply.id + 1;
            }
            })
          }
        });
        
        datafile[0].comments.forEach(element =>{
          if(element.id === id){
            element.replies.push(
              {
                "id": idOfnewmsg,
                "content": text,
                "createdAt": time,
                "score": 0,
                "replyingTo": username,
                "user": {
                  "image": {
                    "png": `./images/avatars/image-${currentusername}.png`,
                    "webp": `./images/avatars/image-${currentusername}.webp`
                  },
                  "username": currentusername
                }
              }
            )
          }
        })
        generateHTML(datafile);
        sendButton();
      });
    });
  });
}

function replyInside(id, username, ReplyingToid){
  //get all the reply inside buttons and then display the inside comment section .
  //Make the chanegs commited to the paragraph tag in the datafile.js file and then regenerate the HTML .
  let replyButtons = document.querySelectorAll(`.js-reply-in-${id} a`);
  //here is the actual probelm both the new comment and the reply button are having the same id after being updated.
 
  replyButtons.forEach(button => {
    button.addEventListener('click', ()=>{
      //generate the html for the replybox;
      //information for the data.json file.
      const currentUser = datafile[0].currentUser.username;
      const creplybox = document.querySelector(`.js-reply-id-${id}`);
      const nreplybox = document.createElement('div');
      nreplybox.classList.add('commment-replymsg-container', 'ReplyBox', 'comment-box-container');
      nreplybox.innerHTML = `
      <div class="profile-new">
          <img src="images/avatars/image-${currentUser}.png" alt="profile-picture" height="35px">
      </div>

      <div class="Text-Area js-textArea-${button}">
        <textarea rows="4" cols="50">@ </textarea>
      </div>

      <div class="Send-Button js-replyinsidebutton-${button}">
        <button>Reply</button>
      </div>
      `
      creplybox.insertAdjacentElement('afterend',nreplybox);
      
      const cSendButton = document.querySelector(`.js-replyinsidebutton-${button}`);
      cSendButton.addEventListener('click', ()=>{
        const text = document.querySelector(`.js-textArea-${button} textarea`).value;
        const currentusername = datafile[0].currentUser.username;
        const time = "1 month ago";

        //append this to the file and then regenerate the HTML
        //calculate the heigheset number of the given sequence
        let idOfnewmsg = 0;
        datafile[0].comments.forEach(element => {
          if(idOfnewmsg <= element.id){
            idOfnewmsg = element.id + 1;
          }
          if(element.replies.length > 0){
            element.replies.forEach(reply => {
            if(idOfnewmsg <= reply.id){
              idOfnewmsg = reply.id + 1;
            }
            })
          }
        });
        
        datafile[0].comments.forEach(element =>{
          if(element.id === ReplyingToid){
            element.replies.push(
              {
                "id": idOfnewmsg,
                "content": text,
                "createdAt": time,
                "score": 0,
                "replyingTo": username,
                "user": {
                  "image": {
                    "png": `./images/avatars/image-${currentusername}.png`,
                    "webp": `./images/avatars/image-${currentusername}.webp`
                  },
                  "username": currentusername
                }
              }
            )
          }
        })
        generateHTML(datafile);
        sendButton();
      });
    });
  });

}


function deleteButton(idOfDeleteButton, replymsgId){
  let deleteButtons = document.querySelectorAll(`.js-Delete-Id-${idOfDeleteButton}`)

  deleteButtons.forEach(button => {
    button.addEventListener('click',()=>{
      datafile[0].comments.forEach(comment =>{
        if(comment.id === replymsgId){
          if(comment.replies.length > 0){
            comment.replies.forEach((reply, index) =>{
              if(reply.id === idOfDeleteButton){
                comment.replies.splice(index, 1);
              }
            })
          }
        }
      })
      generateHTML(datafile);
      sendButton();
    })
  });
}

function upVoteDownVote(replyId) {
  const cPlus = document.querySelectorAll(`.js-plus-${replyId}`);
  const cMinus = document.querySelectorAll(`.js-minus-${replyId}`);

  // Add the plus number functionality. Each button will have the default as false
  cPlus.forEach(plusbutton => {
    plusbutton.addEventListener('click', () => {
      // Get the comment id score
      let presentScore;
      datafile[0].comments.forEach(comment => {
        if (comment.id === replyId) {
          presentScore = comment.score;
        }
        if (comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            if (reply.id === replyId) {
              presentScore = reply.score;
            }
          });
        }
      });
      // Add 1 to the score 
      const newScore = presentScore + 1;

      // Update the score in the datafile
      datafile[0].comments.forEach(comment => {
        if (comment.id === replyId) {
          comment.score = newScore;
        }
        if (comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            if (reply.id === replyId) {
              reply.score = newScore;
            }
          });
        }
      });
      // Set the score to the textarea of the next sibling Element (i.e., the textarea where the score is displayed.)
      plusbutton.nextElementSibling.textContent = newScore;
    });
  });

  // Add the minus number functionality. Each button will have the default as false
  cMinus.forEach(minusbutton => {
    minusbutton.addEventListener('click', () => {
      // Get the comment id score
      let presentScore;
      datafile[0].comments.forEach(comment => {
        if (comment.id === replyId) {
          presentScore = comment.score;
        }
        if (comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            if (reply.id === replyId) {
              presentScore = reply.score;
            }
          });
        }
      });
      // Subtract 1 from the score 
      const newScore = presentScore - 1;

      // Update the score in the datafile
      datafile[0].comments.forEach(comment => {
        if (comment.id === replyId) {
          comment.score = newScore;
        }
        if (comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            if (reply.id === replyId) {
              reply.score = newScore;
            }
          });
        }
      });
      // Set the score to the textarea of the previous sibling Element (i.e., the textarea where the score is displayed.)
      minusbutton.previousElementSibling.textContent = newScore;
    });
  });
}
