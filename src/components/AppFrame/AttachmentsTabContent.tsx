import { useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import UploadOutlined from '@mui/icons-material/UploadOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { getAttachmentsForPatient } from '../../data/mockAttachments';

const STICKY_ACTIONS_CELL = {
  position: 'sticky' as const,
  right: 0,
  minWidth: 88,
  width: 88,
  bgcolor: 'background.paper',
  boxShadow: '-4px 0 8px -2px rgba(0,0,0,0.06)',
  zIndex: 1,
  whiteSpace: 'nowrap' as const,
};
const STICKY_ACTIONS_HEADER = { ...STICKY_ACTIONS_CELL, bgcolor: 'grey.50', zIndex: 2 };

export interface AttachmentsTabContentProps {
  patientId: string;
}

export function AttachmentsTabContent({ patientId }: AttachmentsTabContentProps) {
  const attachments = useMemo(() => getAttachmentsForPatient(patientId), [patientId]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 2,
          pt: 2,
          pb: 1.5,
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Attachments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<UploadOutlined sx={{ fontSize: 18 }} />}
          sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
        >
          Upload
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: 0, overflow: 'auto', borderRadius: 0, boxShadow: 'none' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Document name</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Date added</TableCell>
              <TableCell sx={{ fontWeight: 600, ...STICKY_ACTIONS_HEADER }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attachments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No documents yet.
                </TableCell>
              </TableRow>
            ) : (
              attachments.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.dateAdded}</TableCell>
                  <TableCell sx={STICKY_ACTIONS_CELL} align="right">
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0, flexWrap: 'nowrap' }}>
                      <Tooltip title="Download">
                        <IconButton size="small" aria-label="Download">
                          <DownloadOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Preview">
                        <IconButton size="small" aria-label="Preview">
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
