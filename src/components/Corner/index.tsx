"use client";
import corner_output from "public/data/json/corner_output.json";
import { useState } from "react";
import React from "react";
import commutator from "@/utils/commutator";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import codeConverter from "@/utils/codeConverter";
import finger from "@/utils/finger";

const Corner = () => {
  const tableRef = useRef<HTMLTableElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTableMutation = (mutation: MutationRecord) => {
      if (
        mutation.addedNodes.length > 0 &&
        mutation.addedNodes[0] === tableRef.current
      ) {
        adjustTableFontSize();
      }
    };

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        handleTableMutation(mutation);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const handleResize = () => {
      if (tableRef.current) {
        tableRef.current.style.fontSize = "16px";
        adjustTableFontSize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const adjustTableFontSize = () => {
    if (tableRef.current && divRef.current) {
      const tableWidth = tableRef.current.offsetWidth;
      const divWidth = divRef.current.offsetWidth;
      const ratio = tableWidth / divWidth;
      if (ratio > 1) {
        const newFontSize = 16 / ratio;
        tableRef.current.style.fontSize = `${newFontSize}px`;
      }
    }
  };

  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [selectValues, setSelectValues] = useState(["", "", ""]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setInputText(newValue);
    setSelectValues(codeConverter.customCodeToPosition(newValue, "corner"));
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const newSelectValues = [...selectValues];
    newSelectValues[index] = e.target.value;
    setSelectValues(newSelectValues);
    setInputText(codeConverter.positionToCustomCode(newSelectValues));
  };

  return (
    <>
      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  {t("corner.title")}
                </h2>
                <p>{t("corner.hint")}</p>
                <div className="mb-3 mr-2 mt-4 inline-block font-bold text-dark dark:text-white">
                  {t("common.position")}
                </div>
                {[0, 1, 2].map((index) => (
                  <React.Fragment key={index}>
                    <select
                      value={selectValues[index]}
                      onChange={(e) => handleSelectChange(e, index)}
                      className="text-transform: w-[3.5rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 text-base font-medium uppercase text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-black dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    >
                      <option></option>
                      {codeConverter.positionArray
                        .filter(
                          (position) =>
                            codeConverter.positionToCodeType(position) ===
                            "corner",
                        )
                        .map((position) => (
                          <option key={position}>{position}</option>
                        ))}
                    </select>
                    {index !== 2 && <span className="mx-1">--</span>}
                  </React.Fragment>
                ))}
                <div className="mb-8">
                  <label
                    htmlFor="inputText"
                    className="mb-3 mt-4 inline-block font-bold text-dark dark:text-white"
                  >
                    {t("common.pairs")}
                  </label>
                  <input
                    id="inputText"
                    type="text"
                    placeholder=""
                    className="text-transform: ml-2 w-[4rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit px-3 py-1 text-base font-medium uppercase text-dark outline-none outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    autoComplete="off"
                    maxLength={3}
                    value={inputText}
                    onChange={handleInputChange}
                  />
                  <div ref={divRef} className="mt-4">
                    {(() => {
                      const code = codeConverter.customCodeToInitCode(
                        inputText,
                        "corner",
                      );
                      const variantCode = codeConverter.initCodeToVariantCode(
                        code,
                        "corner",
                      );
                      const tableElements: JSX.Element[] = [];
                      for (const [key, value] of Object.entries(
                        corner_output,
                      )) {
                        if (!variantCode.includes(key)) {
                          continue;
                        }
                        const tableRows: JSX.Element[] = [];
                        for (let i = 0; i < value.length; i++) {
                          const item = value[i];
                          const commutatorResult = commutator.search({
                            algorithm: item,
                            maxDepth: 1,
                          })[0];
                          const fingerResult = finger
                            .fingerbeginfrom(item)
                            .map((finger) => t(finger))
                            .join("/");
                          tableRows.push(
                            <tr key={`${key}-${i}`}>
                              <td>{i + 1}</td>
                              <td>{item}</td>
                              <td>{commutatorResult}</td>
                              <td>{fingerResult}</td>
                            </tr>,
                          );
                        }
                        tableElements.push(
                          <table ref={tableRef} key={key}>
                            <thead>
                              <tr>
                                <th>{t("table.no")}</th>
                                <th>{t("table.algorithm")}</th>
                                <th>{t("table.commutator")}</th>
                                <th>{t("table.thumbPosition")}</th>
                              </tr>
                            </thead>
                            <tbody>{tableRows}</tbody>
                          </table>,
                        );
                      }
                      return tableElements;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Corner;
