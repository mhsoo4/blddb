const codeConverter = (function () {
  const localStorageKey = "code";
  const letteringSchemes = {
    Chichu: "DEGC GAAJEDCX TQLMBBLS QNJYKHIR ZZPSHFFY WTNPWIXK OOMR",
    Speffz: "AABD BDCCEEFH FHGGIIJL JLKKMMNP NPOOQQRT RTSSUUVX VXWW",
  };
  const initialInputValues = letteringSchemes["Chichu"];
  // prettier-ignore
  const positionArray = [
    "UBL", "UB", "UBR", "UL", "U", "UR", "UFL", "UF", "UFR",
    "LUB", "LU", "LUF", "LB", "L", "LF", "LDB", "LD", "LDF",
    "FUL", "FU", "FUR", "FL", "F", "FR", "FDL", "FD", "FDR",
    "RUF", "RU", "RUB", "RF", "R", "RB", "RDF", "RD", "RDB",
    "BUR", "BU", "BUL", "BR", "B", "BL", "BDR", "BD", "BDL",
    "DFL", "DF", "DFR", "DL", "D", "DR", "DBL", "DB", "DBR",
  ];
  // prettier-ignore
  const nextPositionsMap = {
    "UBL": "LUB", "LUB": "BUL", "BUL": "UBL",
    "UBR": "BUR", "BUR": "RUB", "RUB": "UBR",
    "UFL": "FUL", "FUL": "LUF", "LUF": "UFL",
    "UFR": "RUF", "RUF": "FUR", "FUR": "UFR",
    "DFL": "LDF", "LDF": "FDL", "FDL": "DFL",
    "DFR": "FDR", "FDR": "RDF", "RDF": "DFR",
    "DBL": "BDL", "BDL": "LDB", "LDB": "DBL",
    "DBR": "RDB", "RDB": "BDR", "BDR": "DBR",
    "UB": "BU", "BU": "UB",
    "UL": "LU", "LU": "UL",
    "UR": "RU", "RU": "UR",
    "UF": "FU", "FU": "UF",
    "BL": "LB", "LB": "BL",
    "FL": "LF", "LF": "FL",
    "BR": "RB", "RB": "BR",
    "FR": "RF", "RF": "FR",
    "DF": "FD", "FD": "DF",
    "DL": "LD", "LD": "DL",
    "DR": "RD", "RD": "DR",
    "DB": "BD", "BD": "DB",
  };

  function codeTypeToNumber(codeType: string) {
    const codeTypeToNumberMap = {
      edge: 2,
      corner: 3,
    };
    return codeTypeToNumberMap[codeType] || 1;
  }

  function positionToCodeType(position: string) {
    const positionLengthToCodeType = {
      1: "center",
      2: "edge",
      3: "corner",
    };
    return positionLengthToCodeType[position.length] || "";
  }

  function customCodeToInitCode(code: string, codeType: string) {
    let storedValues = "";
    if (typeof localStorage !== "undefined") {
      storedValues =
        localStorage.getItem(localStorageKey) ?? initialInputValues;
    }
    const result: string[] = Array(code.length).fill(" ");
    for (const i in positionArray) {
      if (positionToCodeType(positionArray[i]) !== codeType) {
        continue;
      }
      for (let j = 0; j < code.length; j++) {
        if (storedValues[i] === code[j]) {
          result[j] = initialInputValues[i];
        }
      }
    }
    return result.join("");
  }

  function customCodeToPosition(code: string, codeType: string) {
    if (codeType === "parity") {
      return [
        ...customCodeToPosition(code.slice(0, 2), "edge"),
        ...customCodeToPosition(code.slice(2, 4), "corner"),
      ];
    }
    let storedValues = "";
    if (typeof localStorage !== "undefined") {
      storedValues =
        localStorage.getItem(localStorageKey) ?? initialInputValues;
    }
    const result: string[] = Array(code.length).fill(" ");
    for (const i in positionArray) {
      if (positionToCodeType(positionArray[i]) !== codeType) {
        continue;
      }
      for (let j = 0; j < code.length; j++) {
        if (storedValues[i] === code[j]) {
          result[j] = positionArray[i];
        }
      }
    }
    return result;
  }

  function positionToInitCode(position: string[]) {
    let result = "";
    for (const pos of position) {
      const index = positionArray.indexOf(pos);
      if (index !== -1) {
        result += initialInputValues[index];
      }
    }
    return result;
  }

  function positionToCustomCode(position: string[]) {
    let storedValues = "";
    if (typeof localStorage !== "undefined") {
      storedValues =
        localStorage.getItem(localStorageKey) ?? initialInputValues;
    }
    let result = "";
    for (const pos of position) {
      const index = positionArray.indexOf(pos);
      if (index !== -1) {
        result += storedValues[index];
      }
    }
    return result;
  }

  function generateCyclicPermutations(arr: string[]): string[] {
    const permutations: string[] = [];
    for (const str of arr) {
      for (let j = 0; j < str.length; j++) {
        const rotatedStr = str.slice(j) + str.slice(0, j);
        permutations.push(rotatedStr);
      }
    }
    return permutations;
  }

  function cartesianProduct(arrays: string[][]): string[] {
    return arrays.reduce((a, b) => a.flatMap((x) => b.map((y) => x + y)));
  }

  function customCodeToVariantCode(code: string, codeType: string) {
    if (codeType === "parity") {
      return cartesianProduct([
        customCodeToVariantCode(code.slice(0, 2), "edge"),
        customCodeToVariantCode(code.slice(2, 4), "corner"),
      ]);
    }
    const result = customCodeToPosition(code, codeType);
    const displacePositions: string[][] = [result];
    for (let i = 1; i < codeTypeToNumber(codeType); i++) {
      displacePositions.push(
        displacePositions[i - 1].map((pos) => nextPositionsMap[pos]),
      );
    }
    const displaceCode = displacePositions
      .map((pos) => positionToInitCode(pos))
      .filter((initCode) => initCode.trim() !== "");
    const variantCode = generateCyclicPermutations(displaceCode);
    return variantCode;
  }

  return {
    positionToCodeType,
    customCodeToInitCode,
    customCodeToPosition,
    positionToCustomCode,
    customCodeToVariantCode,
    codeTypeToNumber,
    initialInputValues,
    letteringSchemes,
    positionArray,
  };
})();

export default codeConverter;
