import { useMemo, useState } from 'react';
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
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import UploadOutlined from '@mui/icons-material/UploadOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { getAttachmentsForPatient, type AttachmentType } from '../../data/mockAttachments';

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

const TYPE_OPTIONS: AttachmentType[] = [
  'Intake',
  'Immunization record',
  'Medical order form',
  'Letter of referral',
];

const TYPE_LABELS: Record<AttachmentType, string> = {
  Intake: 'Intake',
  'Immunization record': 'Immunization',
  'Medical order form': 'Order',
  'Letter of referral': 'Referral',
};

export function AttachmentsTabContent({ patientId }: AttachmentsTabContentProps) {
  const [typeFilter, setTypeFilter] = useState<AttachmentType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const attachments = useMemo(() => getAttachmentsForPatient(patientId), [patientId]);
  const filteredAttachments = useMemo(() => {
    let list = attachments;
    if (typeFilter) list = list.filter((a) => a.type === typeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }
    return list;
  }, [attachments, typeFilter, searchQuery]);

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
          flexDirection: 'column',
          gap: 1.5,
          px: 2,
          pt: 2,
          pb: 1.5,
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Attachments
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            minHeight: 32,
            flexWrap: 'nowrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              height: 32,
            }}
          >
            {TYPE_OPTIONS.map((type) => (
              <Chip
                key={type}
                label={TYPE_LABELS[type]}
                size="small"
                variant={typeFilter === type ? 'filled' : 'outlined'}
                color={typeFilter === type ? 'primary' : 'default'}
                onClick={() => setTypeFilter((prev) => (prev === type ? null : type))}
                sx={{ fontWeight: typeFilter === type ? 600 : 500, borderRadius: '8px', height: 32 }}
              />
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              height: 32,
            }}
          >
            <TextField
              size="small"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 220,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  height: 32,
                  '& .MuiInputBase-input': { py: 0.75 },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<UploadOutlined sx={{ fontSize: 18 }} />}
              sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none', height: 32, minHeight: 32 }}
            >
              Upload
            </Button>
          </Box>
        </Box>
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
            {filteredAttachments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  {attachments.length === 0 ? 'No documents yet.' : 'No documents match your filters.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAttachments.map((row) => (
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
