import ErrorScreen from "./ErrorScreen";

export default function NoMatch() {
  return (
    <ErrorScreen
      code="404"
      title="This page doesn't exist"
      message="The link may be outdated or mistyped. Everything worth seeing lives on the main page."
    />
  );
}
