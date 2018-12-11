var rNumber = 0; // Counter for rows
var verAdmin = 1; // Counter for DataBase version
var verFormular = 1; // Counter for FormularBase version
var xTemp; // Global variable for saving object from database 


//Function show hidden content of tab page on click:
function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();




window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB; // define indexedDB so it can be used in these browsers

//Create "DataBase" in browser memory and if it alredy exist set verAdmin to current version
var req1 = window.indexedDB.open("DataBase");
req1.onupgradeneeded = function(e) {
    db = req1.result;
    store = db.createObjectStore("non", { keyPath: "formId"});
} 
req1.onsuccess = function(e) {
    db = req1.result;
    verAdmin = db.version;
    db.close();
}

var requestDB = window.indexedDB.open("DataBase",verAdmin);
requestDB.onupgradeneeded = function(e) {
    db = requestDB.result;
    store = db.createObjectStore("non", { keyPath: "formId"}); 
};
requestDB.onsuccess = function(e) {
    db = requestDB.result;
    verAdmin = db.version;
    db.close();
}



                /*  FUNCTIONS FOR TAB ADMINISTRATOR */
//Add new formular row if needed
function addRow() {
    rNumber++;
    var nRow = "Element " + rNumber + " &nbsp; <input id=\"rowInput"+rNumber+"\" type=\"text\" placeholder=\"Label "+rNumber+"\"> &nbsp;<select id=\"caseOne"+rNumber+"\" onchange=\"myRadio(this.id);blocking1(this.id,"+rNumber+")\"><option value=\"text\" >Text Box</option><option value=\"checkbox\" >Check Box</option><option  value=\"radio\" >Radio Buttons</option></select>&nbsp;<select id=\"caseTwo"+rNumber+"\" onchange=\"blocking2(this.id,"+rNumber+")\" ><option value=\"required\" >Mandatory</option><option >None</option><option value=\"numeric\" >Numeric</option></select>";
    var nChild = document.createElement("div");
    nChild.setAttribute("id","row"+rNumber);
    var parent = document.getElementById("parent");
    nChild.innerHTML=nRow;
    parent.appendChild(nChild); 
}
// Function blocking1 and blocking2 block option in two select list
function blocking1 (xId,xnumb) {
    if (document.getElementById(xId).value == "radio" || document.getElementById(xId).value == "checkbox") {
        document.getElementById("caseTwo"+xnumb)[2].disabled = true;
    } else if (document.getElementById(xId).value == "text") {
        document.getElementById("caseTwo"+xnumb)[2].disabled = false;
    }
}
function blocking2 (xId,xnumb) {
    if (document.getElementById(xId).value == "numeric") {
        document.getElementById("caseOne"+xnumb)[1].disabled = true;
        document.getElementById("caseOne"+xnumb)[2].disabled = true;
    }
    else {
        document.getElementById("caseOne"+xnumb)[1].disabled = false;
        document.getElementById("caseOne"+xnumb)[2].disabled = false;
    }
}
// Create select list to chose how many radio option we need
function myRadio(selectedId){
    var radioChild = document.getElementById(selectedId).value; // Value of id="caseOne" option
    var x = document.getElementById(selectedId).parentNode;  // Parent element of id="caseOne"
    var d = document.createElement("box");
    var lastChild = x.lastElementChild;
    var deleteChild = document.getElementById("radio"+selectedId);
    if ( radioChild == "radio") {
        var newDiv = "<select id=\"radio"+selectedId+"\" onchange =\"addRadioButtons(this.id, this.value)\"><option value=\"0\">-</option><option value=\"1\">1</option><option value=\"2\">2</option><option value=\"3\">3</option></select>";
        x.insertBefore(d,lastChild).innerHTML = newDiv;
    }
    else if (deleteChild && radioChild != "radio") {
        // "for" loop : delete all elements with id= "label+numb" before switching from Radio Buttons to another option
        for(var numb=1;numb<=3;numb++){
            if(document.getElementById("labeldivradio"+selectedId+numb)){
                var x = document.getElementById("labeldivradio"+selectedId+numb);
                x.parentNode.removeChild(x);
            }
        }
        deleteChild.parentNode.removeChild(deleteChild);
    }
}

// Function add optional number of new textbox
function addRadioButtons (addId, addValue) {
    var parent = document.getElementById(addId).parentNode.parentNode; // Get node of <form>
    // "for" loop : delete all elements with id= "label+numb" before changing number of radio button labels
    for(var numb=1;numb<=3;numb++){
        if(document.getElementById("labeldiv"+addId+numb)){
            var x = document.getElementById("labeldiv"+addId+numb);
            x.parentNode.removeChild(x);
        }
    }
    for (var i = 1; i <= addValue; i++) {
        var radioBtnLbl = "<input id=\"label"+addId+i+"\" type=\"text\" placeholder=\"Radio button label "+i+"\">";
        var radioElement = document.createElement("div"); // Create new <div>
        radioElement.setAttribute("id", "labeldiv"+addId+i);
        radioElement.className = "rBl";
        parent.appendChild(radioElement).innerHTML = radioBtnLbl;
    }
}

// Fuction for saving and updating formular template from tab Administrator 
function saveForm() {
    var db,tx,store;
    var formTemplate = {};
    var SearchInput = document.getElementById("request").value;
    formTemplate.formName = SearchInput;
    for (var j = 1; j <= rNumber; j++) {
        formTemplate["rowId"+j] = document.getElementById("row"+j).id;
        formTemplate["rowInput"+j] = document.getElementById("rowInput"+j).value;
        formTemplate["rowCaseOne"+j] = document.getElementById("caseOne"+j).value;
        formTemplate["rowSelectedOne"+j] = document.getElementById("caseOne"+j).selectedIndex;
        var keeper = "row"+j;
        if (document.getElementById("caseOne"+j).value == "radio"){
            formTemplate["radio"+"caseOne"+j] = document.getElementById("radiocaseOne"+j).value;
            var help = document.getElementById("radiocaseOne"+j).value;
            for (var i = 1; i <= help; i++) {
                formTemplate["radioLabel"+keeper+i] = document.getElementById("labelradiocaseOne"+j+i).value;
            }
        }
        formTemplate["rowNumber"] = rNumber;
        formTemplate["rowCaseTwo"+j] = document.getElementById("caseTwo"+j).value;
        formTemplate["rowSelectedTwo"+j] = document.getElementById("caseTwo"+j).selectedIndex;
    }
    var requestDB = window.indexedDB.open("DataBase",verAdmin);
    requestDB.onupgradeneeded = function(e) {
        db = requestDB.result;
        store = db.createObjectStore(SearchInput, { keyPath: "formId"}); 
    };
    requestDB.onerror = function(e) {
        console.log("Error: " + e.target.errorCode);
    };
    requestDB.onsuccess = function(e) {
        db = requestDB.result;
        tx = db.transaction(SearchInput,"readwrite");
        store = tx.objectStore(SearchInput);
        store.put({formId: SearchInput, form: formTemplate});
        if (db.objectStoreNames.contains(SearchInput)) {
            verAdmin = db.version;
        } else {
            verAdmin = db.version + 1;
        }
        db.close();
    };
    rNumber = 0;
    alert ("Templete with name: "+document.getElementById("request").value+" is saved in DataBase!");
    document.getElementById("parent").innerHTML = "";
    document.getElementById("add").style.display = "none";
    document.getElementById("save").style.display = "none";
    document.getElementById("delete").style.display = "none";
}



// Function for cheking if template with search input is alredy in data base
function myFind () {
    var searchRequest = document.getElementById("request").value;
    var requestDB = window.indexedDB.open("DataBase");
	requestDB.onsuccess = function(event){
        var db = event.target.result;
        if (db.objectStoreNames.contains(searchRequest)) {
	    	var tx = db.transaction(document.getElementById("request").value,"readonly");
	    	var store = tx.objectStore(document.getElementById("request").value);
            store.get(searchRequest).onsuccess = function(event) {xTemp = event.target.result;
                document.getElementById("parent").innerHTML = "";
                rNumber = 0; // if searched again reset row counter to starting value
                showTemplate();
                document.getElementById("add").style.display = "block";
                document.getElementById("save").style.display = "block";
                document.getElementById("delete").style.display = "block";

                verAdmin = db.version;  
            };
        } else {
            document.getElementById("parent").innerHTML = "";
            rNumber = 0; // if searched again reset row counter to starting value
            addRow()
            document.getElementById("add").style.display = "block";
            document.getElementById("save").style.display = "block";
            document.getElementById("delete").style.display = "block";
            verAdmin = db.version + 1;
        }
        db.close();
    };

}

// Fill administrator tab with existing formular
function showTemplate () {
    rNumber = 0;
    var formTemplate = xTemp.form;
    for ( var i = 1; i <= formTemplate.rowNumber; i++){
        var existingRow = "Element " + i + " &nbsp; <input id=\"rowInput"+i+"\" type=\"text\" placeholder=\"Label "+i+"\"> &nbsp;<select id=\"caseOne"+i+"\" onchange=\"myRadio(this.id);blocking1(this.id,"+i+")\"><option value=\"text\" >Text Box</option><option value=\"checkbox\" >Check Box</option><option  value=\"radio\" >Radio Buttons</option></select>&nbsp;<select id=\"caseTwo"+i+"\" onchange=\"blocking2(this.id,"+i+")\" ><option value=\"required\" >Mandatory</option><option >None</option><option value=\"numeric\" >Numeric</option></select>";
        var child = document.createElement("div");
        child.setAttribute("id","row"+i);
        parent = document.getElementById("parent");
        parent.appendChild(child).innerHTML = existingRow;
        document.getElementById("rowInput"+i).value = formTemplate["rowInput"+i];
        document.getElementById("caseOne"+i).selectedIndex = formTemplate["rowSelectedOne"+i];
        if (formTemplate["rowSelectedOne"+i] == 2) {
            myRadio("caseOne"+i);
            document.getElementById("radiocaseOne"+i).selectedIndex = formTemplate["radiocaseOne"+i];
            addRadioButtons("radiocaseOne"+i,formTemplate["radiocaseOne"+i]);
            for (var j = 1; j <= formTemplate["radiocaseOne"+i]; j++) {
                document.getElementById("labelradiocaseOne"+i+j).value = formTemplate["radioLabelrow"+i+j];
            }
        }
        document.getElementById("caseTwo"+i).selectedIndex = formTemplate["rowSelectedTwo"+i];
        rNumber++;
    }
}
function removeRow() {
    var x=document.getElementById("parent");
    x.removeChild(x.lastChild);
    rNumber--;
}

                                        /* END  */


                            /*FUNCTIONS FOR TAB FORMULAR  */


var requestFB = window.indexedDB.open("FormularBase",verFormular);
requestFB.onupgradeneeded = function(e) {
    db = e.target.result;
    store = db.createObjectStore("non1", { keyPath: "formularId"}); 
};
requestFB.onsuccess = function(e) {
    db = e.target.result;
    verFormular = db.version;
    db.close();
}

// Function for loading existing formular template
function myFindLoad() {
    var searchInput = document.getElementById("loadRequest").value;
    var searchVersion = document.getElementById("version").value;
    var loadInput = searchInput + searchVersion;
    var req2 = window.indexedDB.open("FormularBase");
    req2.onsuccess = function(e) {
        db = e.target.result;
        if(db.objectStoreNames.contains(loadInput)) {
            verFormular = db.version;
            fillFormular();
        }
        else {
            showFormular();
            verFormular = db.version + 1;
        }
        db.close();
    }

}

// Function that show, created from template, formular 
function showFormular() {
    var loadInput = document.getElementById("loadRequest").value;
    var requestX = indexedDB.open("DataBase");
	requestX.onsuccess = function(event){
        var db = event.target.result;
        if (db.objectStoreNames.contains(loadInput)) {
	    	var tx = db.transaction(loadInput,"readonly");
	    	var store = tx.objectStore(loadInput);
            store.get(loadInput).onsuccess = function(event) {
                xTemp = event.target.result;
                var formularTemplate = xTemp.form;
                var parent = document.getElementById("parent2");
                parent.innerHTML = "";
                var child = document.createElement("form");
                child.setAttribute("id","formX");
                child.setAttribute("action","JavaScript:saveFormular()")
                parent.appendChild(child);
                var formList = document.getElementById("formX");
                for (var i = 1; i <= formularTemplate.rowNumber; i++) {
                    var rowFormular = "<label  for=\"formularRow"+i+"\">"+element(formularTemplate["rowInput"+i],formularTemplate["rowCaseTwo"+i])+"</label><input type=\"text\" id=\"formularRow"+i+"\">"
                    var child2 = document.createElement("div");
                    child2.setAttribute("id","divRow"+i)
                    formList.appendChild(child2).innerHTML = rowFormular;
                    if (formularTemplate["rowCaseOne"+i] == "checkbox") {
                        document.getElementById("formularRow"+i).setAttribute("type","checkbox");
                    }
                    if (formularTemplate["rowCaseTwo"+i] == "numeric") {
                        document.getElementById("formularRow"+i).setAttribute("type","number");
                        document.getElementById("formularRow"+i).setAttribute("placeholder","number");
                    }
                    if (formularTemplate["rowCaseOne"+i] == "radio") {
                        var opt = formularTemplate["radiocaseOne"+i];
                        delRow = document.getElementById("divRow"+i);
                        formList.removeChild(document.getElementById("divRow"+i));
                        var x = "<label for=\"formularRadio1"+i+"\">"+element(formularTemplate["rowInput"+i],formularTemplate["rowCaseTwo"+i])+"</label> <input type=\"radio\" name=\"radio"+i+"\" id=\"formularRadio1"+i+"\"><label>"+formularTemplate["radioLabelrow"+i+1]+"</label>";
                        formList.appendChild(child2).innerHTML = x;
                        if (opt >= 2) {
                            var newChild2 = document.createElement("div");
                            xSecond = "<label for=\"formularRadio2"+i+"\"></label> <input type=\"radio\" name=\"radio"+i+"\" id=\"formularRadio2"+i+"\"><label>"+formularTemplate["radioLabelrow"+i+2]+"</label>"; 
                            formList.appendChild(newChild2).innerHTML = xSecond;                            
                        }
                        if (opt == 3) {
                            var newChild3 = document.createElement("div");
                            xSecond = "<label for=\"formularRadio3"+i+"\"></label> <input type=\"radio\" name=\"radio"+i+"\" id=\"formularRadio3"+i+"\"><label>"+formularTemplate["radioLabelrow"+i+3]+"</label>";
                            formList.appendChild(newChild3).innerHTML = xSecond;
                        }
                    }
                    if (formularTemplate["rowCaseTwo"+i] == "required" && formularTemplate["rowCaseOne"+i] != "radio") {
                        document.getElementById("formularRow"+i).required = true;
                    }
                    if (formularTemplate["rowCaseTwo"+i] == "required" && formularTemplate["rowCaseOne"+i] == "radio") {
                        document.getElementById("formularRadio1"+i).required = true;
                        var optionNumb =parseInt(formularTemplate["radiocaseOne"+i]);
                        if (optionNumb >= 2) {
                            document.getElementById("formularRadio2"+i).required = true;
                        }
                        if (optionNumb == 3) {
                            document.getElementById("formularRadio3"+i).required = true;
                        }
                    }
                }
                var submit = document.createElement("div");
                child.appendChild(submit).innerHTML = "<input class=\"saveButton2\"  type=\"submit\" value=\"Save\">";
            };
        } else {
            alert("The inputed name for search is invalid please input valid name!");
            return false;
        }
        db.close();
        
    }
}
// Add symbol "*" in tab formular for names with required fields
function element (element,test) {
    if(test == "required"){
        element+="*:";	
    }
    else{
        element+=":"
    }
    return element;
}
// Function save data, from tab formular, in data base FormularBase
function saveFormular() { console.log("uso u saveFormular()");
    var searchInput = document.getElementById("loadRequest").value;
    var searchVersion = document.getElementById("version").value;
    var saveInput = searchInput + searchVersion;
    var nodeFormular = document.getElementById("formX").childNodes;
    var numbForm = nodeFormular.length - 1;
    var saveData = {};
    for (var i = 0; i < numbForm; i++) {
        if (nodeFormular[i].childNodes.length == 2) {
            saveData["element"+i] = nodeFormular[i].childNodes[0].innerText;
            if(nodeFormular[i].childNodes[1].getAttribute("type") == "text") {
                saveData["value"+i] = nodeFormular[i].childNodes[1].value;
            }
            else if(nodeFormular[i].childNodes[1].getAttribute("type") == "number") {
                saveData["value"+i] = nodeFormular[i].childNodes[1].value;
            }
            saveData["required"+i] = nodeFormular[i].childNodes[1].hasAttribute("required");
            saveData["type"+i] = nodeFormular[i].childNodes[1].getAttribute("type");
            saveData["selected"+i] = nodeFormular[i].childNodes[1].checked;
        }
        else if (nodeFormular[i].childNodes.length == 4) {
            saveData["element"+i] = nodeFormular[i].childNodes[0].innerText;
            saveData["radioName"+i] = nodeFormular[i].childNodes[2].getAttribute("name");
            saveData["value"+i] = nodeFormular[i].childNodes[3].innerText;
            saveData["required"+i] = nodeFormular[i].childNodes[2].hasAttribute("required");
            saveData["type"+i] = nodeFormular[i].childNodes[2].getAttribute("type");
            saveData["selected"+i] = nodeFormular[i].childNodes[2].checked;
        } else if (nodeFormular[i].childNodes.length == 3 && nodeFormular[i].childNodes[1].getAttribute("type") == "radio") { // when we load data from memory there are only 3 nodes insted of 4 so we need this for radio button
            saveData["element"+i] = nodeFormular[i].childNodes[0].innerText;
            saveData["radioName"+i] = nodeFormular[i].childNodes[1].getAttribute("name");
            saveData["value"+i] = nodeFormular[i].childNodes[2].innerText;
            saveData["required"+i] = nodeFormular[i].childNodes[1].hasAttribute("required");
            saveData["type"+i] = nodeFormular[i].childNodes[1].getAttribute("type");
            saveData["selected"+i] = nodeFormular[i].childNodes[1].checked;
        }
    }
    saveData["rowNumber"] = numbForm;
    var requestDB = window.indexedDB.open("FormularBase",verFormular);
    requestDB.onupgradeneeded = function(e) {
        db = requestDB.result;
        store = db.createObjectStore(saveInput, { keyPath: "formularId"}); 
    };
    requestDB.onerror = function(e) {
        console.log("Error: " + e.target.errorCode);
    };
    requestDB.onsuccess = function(e) {
        db = requestDB.result;
        tx = db.transaction(saveInput,"readwrite");
        store = tx.objectStore(saveInput);
        store.put({formularId: saveInput, form: saveData});
        db.close();
    };
    alert("Formular is saved in FormularBase with name: "+saveInput);

}
// Load data to formular from memory ("FormularBase")
function fillFormular() {
    var searchInput = document.getElementById("loadRequest").value;
    var searchVersion = document.getElementById("version").value;
    var saveInput = searchInput + searchVersion;
    var child = document.createElement("form");
    child.setAttribute("id","formX");
    child.setAttribute("action","JavaScript:saveFormular()");
    var parent = document.getElementById("parent2");
    parent.innerHTML = "";
    parent.appendChild(child);
    var formList = document.getElementById("formX");
    var req = indexedDB.open("FormularBase",verFormular);
    req.onsuccess = function(event) {
        db = event.target.result;
        tx = db.transaction(saveInput,"readonly");
        store = tx.objectStore(saveInput);
        store.get(saveInput).onsuccess = function(event) {
            var xForm1 = event.target.result;
            var xForm = xForm1.form;
            for (var i = 0; i < xForm.rowNumber; i++) {
                if(xForm["type"+i] == "radio") {
                    var rowInput = "<label>"+xForm["element"+i]+"</label><input id=\"formRow"+i+"\" type=\"radio\"><label>"+xForm["value"+i]+"</label>";
                    var row = document.createElement("div");
                    formList.appendChild(row).innerHTML = rowInput;
                    document.getElementById("formRow"+i).checked = xForm["selected"+i];
                    document.getElementById("formRow"+i).required=xForm["required"+i];
                    document.getElementById("formRow"+i).setAttribute("name",xForm["radioName"+i]);

                }
                else if (xForm["type"+i] == "text") {
                    var rowInput = "<label>"+xForm["element"+i]+"</label><input id=\"formRow"+i+"\" type=\"text\">";
                    var row = document.createElement("div");
                    formList.appendChild(row).innerHTML = rowInput;
                    document.getElementById("formRow"+i).required=xForm["required"+i];
                    document.getElementById("formRow"+i).value = xForm["value"+i];
                }
                else if (xForm["type"+i] == "checkbox") {
                    var rowInput = "<label>"+xForm["element"+i]+"</label><input id=\"formRow"+i+"\" type=\"checkbox\">";
                    var row = document.createElement("div");
                    formList.appendChild(row).innerHTML = rowInput;
                    document.getElementById("formRow"+i).required=xForm["required"+i];
                    document.getElementById("formRow"+i).checked = xForm["selected"+i];
                } else {
                    var rowInput = "<label>"+xForm["element"+i]+"</label><input id=\"formRow"+i+"\" type=\"number\">";
                    var row = document.createElement("div");
                    formList.appendChild(row).innerHTML = rowInput;
                    document.getElementById("formRow"+i).value = xForm["value"+i];
                }
            }
            var submit = document.createElement("div");
            child.appendChild(submit).innerHTML = "<input class=\"saveButton2\"  type=\"submit\" value=\"Save\">";

        }
        db.close();

    }
}

                                            /* End */