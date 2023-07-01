import { t } from "../i18n";

export const LoginErrorPage: React.FC<{
  error: Error;
  onClickLogin(): void;
  onClickLogout(): void;
}> = ({ error, onClickLogin, onClickLogout }) => {
  return (
    <>
      {t("LoginErrorPage.msg")}
      <br />
      {`${error}`}
      <br />
      <button type="button" onClick={onClickLogin}>
        {t("generic.try-again")}
      </button>
      <button type="button" onClick={onClickLogout}>
        {t("generic.logout")}
      </button>
    </>
  );
};
