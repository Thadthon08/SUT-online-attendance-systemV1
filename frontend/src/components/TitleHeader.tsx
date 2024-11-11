import { Grid, Typography, Box, alpha } from "@mui/material";

type TitleHeaderProps = {
  Title: string;
  Subtitle: string;
};

export default function TitleHeader({ Title, Subtitle }: TitleHeaderProps) {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        border: `1px solid ${alpha("#E2E8F0", 0.8)}`, // Slate 200 with opacity
        mb: 3,
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          maxWidth: 1472,
          p: { xs: 2, sm: 3 }, // Responsive padding
          mx: "auto", // Center the content
        }}
      >
        <Grid item xs={12}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "text.primary", // Using theme text color
              mb: 1,
              fontSize: { xs: "1.25rem", sm: "1.5rem" }, // Responsive font size
            }}
          >
            {Title}
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              lineHeight: 1.5,
              maxWidth: "800px",
            }}
          >
            {Subtitle}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
