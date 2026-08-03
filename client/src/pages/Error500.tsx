import ErrorScreen from "./ErrorScreen";

export default function Error500() {
  return (
    <ErrorScreen
      code="500"
      title="Something broke on our end"
      message="An unexpected error occurred while rendering this page. Try reloading, or head back to the portfolio."
      accent="#F87171"
    />
  );
}
