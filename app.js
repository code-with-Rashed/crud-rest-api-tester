"use strict";
const selectType = selectElement("selectType");
const raw = selectElement("raw");
const custom = selectElement("custom");
const dataBody = selectElement("data-body");
var uniqueId = 1;

//select any element
function selectElement(element) {
   return document.getElementById(element);
}

//append any element
function dataAppend(appending) {
   dataBody.innerHTML = appending;
}

//create element for custom elemnt
function getElementFromString(string) {
   const div = document.createElement("div");
   div.innerHTML = string;
   return div.firstElementChild;
}

//select data type
selectType.addEventListener("change", (elem) => {
   const dataType = selectElement("dataType");
   if (elem.target.value !== "GET") {
      dataType.style.display = "block";
   }
   if (elem.target.value === "GET") {
      dataType.style.display = "none";
      dataBody.innerHTML = "";
   }
});

//show raw  textbox
raw.addEventListener("click", () => {
   custom.checked = false;
   dataAppend(` <b>Input json format : </b><textarea id="rawBody" cols="30" rows="10"></textarea>`);
});

//show custom input element
custom.addEventListener("click", () => {
   raw.checked = false;
   dataAppend(`<div class="custom-body"><div class="custom-input"><div><p>key :</p><input type="text" class="key" placeholder="key"></div><div><p>value :</p><div class="more"><input type="text" class="value" placeholder="value"><button class="customBtn" onclick="addMore()" title="add more">+</button></div></div></div></div>`);
});

//add custom element
function addMore() {
   uniqueId++;
   dataBody.append(getElementFromString(`<div class="custom-body" id="deleteParam${uniqueId}"><div class="custom-input"><div><p>key :</p><input type="text" class="key" placeholder="key ${uniqueId}"></div><div><p>value :</p><div class="more"><input type="text" class="value" placeholder="value ${uniqueId}"><button class="customBtn" onclick="deleteElement('deleteParam${uniqueId}')" title="close now">-</button></div></div></div></div>`));
};

//delete custom element
function deleteElement(deleteElement) {
   selectElement(deleteElement).remove();
}

// get all information from user
selectElement("go").addEventListener("click", operation);

function operation() {
   let url = selectElement("url");
   let type = selectType.value;
   let rawData = "";
   let customData = {};
   if (custom.checked) {
      const key = document.querySelectorAll(".key");
      const value = document.querySelectorAll(".value");
      [...key].forEach((keys, keyInd) => {
         [...value].forEach((values, valueInd) => {
            if (keyInd === valueInd) {
               customData[keys.value] = values.value;
            }
         });
      });
   }
   
   //url validation
   if (!url.validity.valid) {
        alert("Please enter a valid URL");
        return;
    }else{
      url = selectElement("url").value
    }

   if (raw.checked) {
      rawData = selectElement("rawBody").value;
   }

   if (type === "POST") {
      if (custom.checked) {
         postData(type, url, JSON.stringify(customData));
         return;
      }
      if (raw.checked) {
         postData(type, url, rawData);
         return;
      }
   }

   if (type === "PUT") {
      if (custom.checked) {
         putData(type, url, JSON.stringify(customData));
         return;
      }
      if (raw.checked) {
         putData(type, url, rawData);
         return;
      }
   }

   if (type === "DELETE") {
      if (custom.checked) {
         deleteData(type, url, JSON.stringify(customData));
         return;
      }
      if (raw.checked) {
         deleteData(type, url, rawData);
         return;
      }
   }

   if (type === "GET" && !custom.checked && !raw.checked) {
      getData(type, url);
      return;
   }
}

// Show any result
function showResult(result = null) {
   dataAppend(`<b class="wait">Please Wait ....</b>`);
   if (result !== null) {
      dataAppend(`<b>Result : </b><textarea id="rawBody" cols="30" rows="10">${result}</textarea>`);
   }
}

// Send get request
function getData(type, url) {
   showResult();
   request(type, url)
      .then((res) => {
         if (res) {
            showResult(res);
         }
      })
      .catch(err => showResult(err));
}

// Send post request
function postData(type, url, data) {
   showResult();
   request(type, url, data)
      .then((res) => {
         if (res) {
            showResult(res);
         }
      })
      .catch(err => showResult(err));
}

// Send update request
function putData(type, url, data) {
   showResult();
   request(type, url, data)
      .then((res) => {
         if (res) {
            showResult(res);
         }
      })
      .catch(err => showResult(err));
}

// Send delete request
function deleteData(type, url, data) {
   showResult();
   request(type, url, data)
      .then((res) => {
         if (res) {
            showResult(res);
         }
      })
      .catch(err => showResult(err));
}

// Request handler
const request = function (type, url, data) {
   const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(type, url);
      // xhr.responseType = "json";
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (data) {
         xhr.send(data);
      } else {
         xhr.send();
      }

      xhr.onload = function () {
         if (xhr.status <= 400) {
            resolve(xhr.response);
         } else {
            reject(`Something was wrong. Oops ${xhr.status} ${xhr.statusText}!!!`);
         }
      }
      xhr.onerror = function () {
         reject(`Something was wrong. Oops ${xhr.status} ${xhr.statusText}!!!`);
      }
   });
   return promise;
}