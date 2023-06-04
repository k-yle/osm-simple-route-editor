export const LoginErrorPage: React.FC<{
  error: Error;
  onClickLogin(): void;
  onClickLogout(): void;
}> = ({ error, onClickLogin, onClickLogout }) => {
  return (
    <>
      Failed to login!
      <br />
      {`${error}`}
      <br />
      <button type="button" onClick={onClickLogin}>
        Try Again
      </button>
      <button type="button" onClick={onClickLogout}>
        Logout
      </button>
    </>
  );
};
