import React from "react";

import { Tile } from "carbon-components-react";
import { useTranslation } from "react-i18next";

import styles from "./error-state.scss";

const EmptyState: React.FC<ErrorStateProps> = ({ error, headerTitle }) => {
  const { t } = useTranslation();

  return (
    <Tile light>
      <h1 className={styles.heading}>{headerTitle}</h1>
      <p className={styles.errorMessage}>
        {t("error", "Error")} {`${error.response.status}: `}
        {error.response.statusText}
      </p>
      <p className={styles.errorCopy}>{t("errorCopy")}</p>
    </Tile>
  );
};

export default EmptyState;

type ErrorStateProps = {
  error: any;
  headerTitle: string;
};
