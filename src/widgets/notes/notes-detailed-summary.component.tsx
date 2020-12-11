import React, { useState, useEffect, Fragment } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { capitalize } from "lodash-es";
import { useTranslation } from "react-i18next";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import {
  getEncounterObservableRESTAPI,
  PatientNote
} from "./encounter.resource";
import VisitNotes from "./visit-note.component";
import { openWorkspaceTab } from "../shared-utils";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import { formatDate } from "../biometrics/biometric.helper";
import styles from "./notes-detailed-summary.css";

function NotesDetailedSummary(props: NotesDetailedSummaryProps) {
  const resultsPerPage = 10;
  const [patientNotes, setPatientNotes] = useState<Array<PatientNote>>();
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showNextButton, setShowNextButton] = React.useState(false);
  const [showPreviousButton, setShowPreviousButton] = React.useState(false);
  const [currentPageResults, setCurrentPageResults] = React.useState<
    Array<PatientNote>
  >();
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();

  const match = useRouteMatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const subscription = getEncounterObservableRESTAPI(patientUuid).subscribe(
        notes => {
          setPatientNotes(notes);
          setTotalPages(Math.ceil(notes.length / resultsPerPage));
          setCurrentPageResults(notes.slice(0, resultsPerPage));
        },
        createErrorHandler()
      );

      return () => subscription.unsubscribe();
    }
  }, [patientUuid, isLoadingPatient, patient]);

  useEffect(() => {
    {
      patientNotes && currentPage * resultsPerPage >= patientNotes.length
        ? setShowNextButton(false)
        : setShowNextButton(true);
      currentPage !== 1
        ? setShowPreviousButton(true)
        : setShowPreviousButton(false);
    }
  }, [patientNotes, currentPageResults, currentPage]);

  const nextPage = () => {
    let upperBound = currentPage * resultsPerPage + resultsPerPage;
    const lowerBound = currentPage * resultsPerPage;
    if (upperBound > patientNotes.length) {
      upperBound = patientNotes.length;
    }
    const pageResults = patientNotes.slice(lowerBound, upperBound);
    setCurrentPageResults(pageResults);
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    const lowerBound = resultsPerPage * (currentPage - 2);
    const upperBound = resultsPerPage * (currentPage - 1);
    const pageResults = patientNotes.slice(lowerBound, upperBound);
    setCurrentPageResults(pageResults);
    setCurrentPage(currentPage - 1);
  };

  function displayPatientNotes() {
    return (
      <SummaryCard
        name={t("notes", "Notes")}
        addComponent={VisitNotes}
        showComponent={() =>
          openWorkspaceTab(VisitNotes, `${t("visitNote", "Visit Note")}`)
        }
      >
        <table className={`omrs-type-body-regular ${styles.notesTable}`}>
          <thead>
            <tr
              className={styles.notesTableRow}
              style={{ textTransform: "uppercase" }}
            >
              <th>{t("date", "Date")}</th>
              <th style={{ textAlign: "left" }}>
                {t("note", "Note")}
                <svg
                  className="omrs-icon"
                  style={{
                    height: "0.813rem",
                    fill: "var(--omrs-color-ink-medium-contrast)"
                  }}
                >
                  <use xlinkHref="#omrs-icon-arrow-downward"></use>
                </svg>
                <span style={{ marginLeft: "1.25rem" }}>
                  {t("location", "Location")}
                </span>
              </th>
              <th style={{ textAlign: "left" }}>{t("author", "Author")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentPageResults &&
              currentPageResults.map(note => {
                return (
                  <Fragment key={note.id}>
                    <tr className={styles.notesTableDataRow}>
                      <td className={styles.noteDate}>
                        {formatDate(note?.encounterDate)}
                      </td>
                      <td className={styles.noteInfo}>
                        <span className="omrs-medium">
                          {note.encounterType}
                        </span>
                        <div
                          style={{
                            color: "var(--omrs-color-ink-medium-contrast)",
                            margin: "0rem"
                          }}
                        >
                          {capitalize(note.encounterLocation)}
                        </div>
                      </td>
                      <td className={styles.noteAuthor}>
                        {note.encounterAuthor ? note.encounterAuthor : "\u2014"}
                      </td>
                      <td
                        style={{ textAlign: "end", paddingRight: "0.625rem" }}
                      >
                        <Link to={`${match.path}/${note.id}`}>
                          <svg className="omrs-icon">
                            <use
                              fill="var(--omrs-color-ink-low-contrast)"
                              xlinkHref="#omrs-icon-chevron-right"
                            ></use>
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <div>
            {showPreviousButton && (
              <button
                onClick={previousPage}
                className={`${styles.navButton} omrs-bold omrs-btn omrs-text-neutral omrs-rounded`}
              >
                <svg
                  className="omrs-icon"
                  fill="var(--omrs-color-ink-low-contrast)"
                >
                  <use xlinkHref="#omrs-icon-chevron-left" />
                </svg>
                {t("previous", "Previous")}
              </button>
            )}
          </div>
          {patientNotes.length <= resultsPerPage ? (
            <div
              className="omrs-type-body-regular"
              style={{ fontFamily: "Work Sans" }}
            >
              <p style={{ color: "var(--omrs-color-ink-medium-contrast)" }}>
                {t("noMoreNotesAvailable", "No more notes available")}
              </p>
            </div>
          ) : (
            <div>
              {t("page", "Page")} {currentPage} {t("of", "of")} {totalPages}
            </div>
          )}
          <div>
            {showNextButton && (
              <button
                onClick={nextPage}
                className={`${styles.navButton} omrs-bold omrs-btn omrs-text-neutral omrs-rounded`}
              >
                {t("next", "Next")}
                <svg
                  className="omrs-icon"
                  fill="var(--omrs-color-ink-low-contrast)"
                >
                  <use xlinkHref="#omrs-icon-chevron-right" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </SummaryCard>
    );
  }

  return (
    <>
      {patientNotes && (
        <div className={styles.notesSummary}>
          {patientNotes.length > 0 ? (
            displayPatientNotes()
          ) : (
            <EmptyState
              displayText={t("notes", "notes")}
              headerTitle={t("notes", "Notes")}
              launchForm={() =>
                openWorkspaceTab(VisitNotes, `${t("visitNote", "Visit Note")}`)
              }
            />
          )}
        </div>
      )}
    </>
  );
}

type NotesDetailedSummaryProps = {};

export default NotesDetailedSummary;
