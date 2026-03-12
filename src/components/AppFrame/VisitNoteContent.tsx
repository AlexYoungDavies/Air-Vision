import { Box, Typography } from '@mui/material';
import type { Appointment } from '../../data/mockAppointments';

export interface VisitNoteContentProps {
  /** Unique id for this open note tab */
  noteId: string;
  appointment: Appointment;
}

/**
 * Placeholder for visit note content. Takes over the primary content area when a note is open.
 * Full note UI to be built later.
 */
export function VisitNoteContent({ noteId: _noteId, appointment }: VisitNoteContentProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        p: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Visit note — {appointment.date} · {appointment.template} (placeholder)
      </Typography>
    </Box>
  );
}
