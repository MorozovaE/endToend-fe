import { Box, Container } from "@mui/material";
import { ProjectHeader } from "../components/ProjectHeader/ProjectHeader";
import { ProjectList } from "../components/ProjectList/ProjectList";

export const Projects = () => {
  return (
    <Box>
      <ProjectHeader />
      <Container>
        <ProjectList />
      </Container>
    </Box>
  );
};
