import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

export function renderCategories(categories?: string[]) {
  if (!categories) {
    return <></>;
  }

  return (
    <Stack direction="row" gap={1}>
      {categories.map((item: string) => <Chip key={item} label={item} variant="outlined" />)}
    </Stack>
  );
}

export function renderComplexity(complexity?: string) {
  if (!complexity) {
    return <></>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colors: Record<string, any> = {
    easy: "success",
    medium: "primary",
    hard: "warning",
  }
  return <Chip label={complexity} color={colors[complexity.toLowerCase()] ?? "default"} />;
}
