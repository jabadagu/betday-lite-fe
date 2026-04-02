import Link from "next/link";

import { Typography, Button, Box, Card } from "@betday/components/ui";

export default function NotFound() {
  return (
    <Box className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <Card className="max-w-md text-center space-y-4">
        <Box className="flex justify-center">
          <Box className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary-soft">
            <Typography variant="h1" className="text-4xl text-brand-primary">
              404
            </Typography>
          </Box>
        </Box>
        <Typography variant="h2">Pagina no encontrada</Typography>
        <Typography variant="body2" className="text-tertiary">
          Lo sentimos, la pagina que buscas no existe.
        </Typography>
        <Link href="/">
          <Button size="sm" rounded="full">
            Volver al inicio
          </Button>
        </Link>
      </Card>
    </Box>
  );
}
