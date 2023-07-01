// TODO: i18n
export const LoginPage: React.FC<{ onClickLogin(): void }> = ({
  onClickLogin,
}) => {
  return (
    <>
      You need to login to use this feature
      <br />
      <button type="button" onClick={onClickLogin}>
        Login
      </button>
    </>
  );
};
