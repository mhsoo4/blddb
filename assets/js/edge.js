"use strict";

const edgeNumberToChichu = JSON.parse($.getJSON({"url": "assets/json/edgeNumberToChichu.json", "async": false}).responseText);
const edgeChichuToNumber = JSON.parse($.getJSON({"url": "assets/json/edgeChichuToNumber.json", "async": false}).responseText);
const edgeAlgToStandard = JSON.parse($.getJSON({"url": "assets/json/edgeAlgToStandard.json", "async": false}).responseText);
const edgeAlgToInfo = JSON.parse($.getJSON({"url": "assets/json/edgeAlgToInfo.json", "async": false}).responseText);
const edgeAlgToNightmare = JSON.parse($.getJSON({"url": "assets/json/edgeAlgToNightmare.json", "async": false}).responseText);
const edgePosToCode = JSON.parse($.getJSON({"url": "assets/json/edgePosToCode.json", "async": false}).responseText);
const edgeCodeToPos = JSON.parse($.getJSON({"url": "assets/json/edgeCodeToPos.json", "async": false}).responseText);

function getCookie(cname) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function algSearch() {
    let idValueOrigin = document.getElementById("edgeinput").value;
    if (typeof idValueOrigin === "undefined") {
        return;
    }
    idValueOrigin = idValueOrigin.toUpperCase();
    const id = [idValueOrigin[0], idValueOrigin[1], idValueOrigin[2]];
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (const i in edgeChichuToNumber) {
        for (let j = 0; j <= 2; j++) {
            if (codecookie[edgeChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    document.getElementById("edgeinput1").value = edgeCodeToPos[id[0]];
    document.getElementById("edgeinput2").value = edgeCodeToPos[id[1]];
    document.getElementById("edgeinput3").value = edgeCodeToPos[id[2]];
    let idValue = edgeAlgToStandard[`${id[0]}${id[1]}${id[2]}`];
    const div1 = document.getElementById("div1");
    const rows = 18;
    const setup = simplifyfinal(preprocessing(document.getElementById("edgesetup").value));
    if (setup.length > 0 && edgeAlgToInfo.hasOwnProperty(idValue)) {
        const edgefullstr = edgefull(simplifyfinal(preprocessing(`${simplifyfinal(invert(preprocessing(setup)))} ${edgeAlgToNightmare[idValue]} ${setup}`)));
        idValue = edgeAlgToStandard[edgefullstr[0] + edgefullstr[2] + edgefullstr[1]];
    }
    if (edgeAlgToInfo.hasOwnProperty(idValue)) {
        if (document.getElementById("edgeinput") === document.activeElement) {
            document.getElementById("edgeinput").blur();
        }
        let tab = "";
        let inew = 0;
        for (let i = 0; i < rows; i++) {
            if (edgeAlgToInfo[idValue].length <= i) {
                break;
            }
            let edgeAlgToInfoNew = "";
            if (setup.length > 0) {
                edgeAlgToInfoNew = simplifyfinal(preprocessing(`${setup} ${edgeAlgToInfo[idValue][i]} ${simplifyfinal(invert(preprocessing(setup)))}`));
                if (isnightmare(edgeAlgToInfoNew) === 0) {
                    continue;
                }
                if (stm(edgeAlgToInfoNew) + 1 < stm(simplifyfinal(preprocessing(`${edgeAlgToInfo[idValue][i]} ${simplifyfinal(invert(preprocessing(setup)))}`))) + stm(setup)) {
                    continue;
                }
                inew = inew + 1;
            } else {
                edgeAlgToInfoNew = edgeAlgToInfo[idValue][i];
                inew = inew + 1;
            }
            if (edgeAlgToInfoNew === edgeAlgToNightmare[edgeAlgToStandard[`${id[0]}${id[1]}${id[2]}`]]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            tab += `<td>${inew}</td>`;
            tab += `<td>${edgeAlgToInfoNew}</td>`;
            tab += `<td>${commutator(edgeAlgToInfoNew)}</td>`;
            tab += `<td>${fingerbeginfrom(edgeAlgToInfoNew)}</td>`;
            tab += "</tr>";
        }
        if (tab !== "") {
            tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>${tab}</tbody></table>`;
        }
        div1.innerHTML = tab;
    } else {
        div1.innerHTML = "";
    }
}

function algSearchByPos() {
    const id = [];
    id[0] = edgePosToCode[document.getElementById("edgeinput1").value];
    id[1] = edgePosToCode[document.getElementById("edgeinput2").value];
    id[2] = edgePosToCode[document.getElementById("edgeinput3").value];
    let idValue = edgeAlgToStandard[`${id[0]}${id[1]}${id[2]}`];
    const edgeinput = [];
    if (typeof id[0] === "undefined") {
        id[0] = "";
    }
    if (typeof id[1] === "undefined") {
        id[1] = "";
    }
    if (typeof id[2] === "undefined") {
        id[2] = "";
    }
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (let i = 0; i <= 2; i++) {
        if (id[i] === "") {
            edgeinput[i] = "";
        } else if (codecookie[edgeChichuToNumber[id[i]]] === "") {
            edgeinput[i] = id[i];
        } else {
            edgeinput[i] = codecookie[edgeChichuToNumber[id[i]]];
        }
    }
    document.getElementById("edgeinput").value = `${edgeinput[0]}${edgeinput[1]}${edgeinput[2]}`;
    const div1 = document.getElementById("div1");
    const rows = 18;
    const setup = simplifyfinal(preprocessing(document.getElementById("edgesetup").value));
    if (setup.length > 0 && edgeAlgToInfo.hasOwnProperty(idValue)) {
        const edgefullstr = edgefull(simplifyfinal(preprocessing(`${simplifyfinal(invert(preprocessing(setup)))} ${edgeAlgToNightmare[idValue]} ${setup}`)));
        idValue = edgeAlgToStandard[edgefullstr[0] + edgefullstr[2] + edgefullstr[1]];
    }
    if (edgeAlgToInfo.hasOwnProperty(idValue)) {
        let tab = "";
        let inew = 0;
        for (let i = 0; i < rows; i++) {
            if (edgeAlgToInfo[idValue].length <= i) {
                break;
            }
            let edgeAlgToInfoNew = "";
            if (setup.length > 0) {
                edgeAlgToInfoNew = simplifyfinal(preprocessing(`${setup} ${edgeAlgToInfo[idValue][i]} ${simplifyfinal(invert(preprocessing(setup)))}`));
                if (isnightmare(edgeAlgToInfoNew) === 0) {
                    continue;
                }
                if (stm(edgeAlgToInfoNew) + 1 < stm(simplifyfinal(preprocessing(`${edgeAlgToInfo[idValue][i]} ${simplifyfinal(invert(preprocessing(setup)))}`))) + stm(setup)) {
                    continue;
                }
                inew = inew + 1;
            } else {
                edgeAlgToInfoNew = edgeAlgToInfo[idValue][i];
                inew = inew + 1;
            }
            if (edgeAlgToInfoNew === edgeAlgToNightmare[edgeAlgToStandard[`${id[0]}${id[1]}${id[2]}`]]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            tab += `<td>${inew}</td>`;
            tab += `<td>${edgeAlgToInfoNew}</td>`;
            tab += `<td>${commutator(edgeAlgToInfoNew)}</td>`;
            tab += `<td>${fingerbeginfrom(edgeAlgToInfoNew)}</td>`;
            tab += "</tr>";
        }
        if (tab !== "") {
            tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>${tab}</tbody></table>`;
        }
        div1.innerHTML = tab;
    } else {
        div1.innerHTML = "";
    }
}

function isnightmare(s1) {
    const regString = /^[RUDFBEMSru0-9 ']*$/gu;
    const regPos = /^[0-9]*$/gu;
    if (fingerbeginfrom(s1) !== "" && stm(s1) <= 16 && qtm(s1) <= 18 && count(s1, "R") <= 8 && count(s1, "U") <= 8 && count(s1, "D") <= 6 && count(s1, "F") <= 4 && count(s1, "B") <= 4 && count(s1, "E") <= 4 && count(s1, "M") <= 5 && count(s1, "S") <= 6 && count(s1, "r") <= 4 && count(s1, "u") <= 3 && count(s1, "R2") <= 6 && count(s1, "U2") <= 4 && count(s1, "D2") <= 2 && count(s1, "F2") <= 2 && count(s1, "B2") <= 2 && count(s1, "E2") <= 2 && count(s1, "M2") <= 2 && count(s1, "S2") <= 2 && count(s1, "r2") <= 1 && count(s1, "u2") <= 2 && count(s1, "E") + count(s1, "M") + count(s1, "S") <= 6 && count(s1, "r") + count(s1, "u") <= 4 && regString.test(s1) && regPos.test(s1[0]) === false) {
        return 1;
    }
    return 0;
}