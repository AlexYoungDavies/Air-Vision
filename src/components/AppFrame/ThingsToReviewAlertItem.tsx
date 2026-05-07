import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { ReviewAlertItem } from '../../data/mockPatientVisitPanel';

const subheadingSx = {
  fontSize: 12,
  color: 'text.secondary',
  mt: 0.25,
  lineHeight: 1.45,
} as const;

const tertiaryButtonSx = {
  textTransform: 'none' as const,
  fontWeight: 500,
  minHeight: 28,
  px: 0.75,
  ml: -0.75,
};

type Props = { item: ReviewAlertItem };

export function ThingsToReviewAlertItem({ item }: Props) {
  const isDanger = item.tone === 'danger';
  const borderColor = isDanger ? 'error.main' : 'divider';
  const titleColor = isDanger ? 'error.dark' : 'text.primary';
  const titleWeight = isDanger ? 600 : 500;

  return (
    <Box
      sx={{
        minWidth: 0,
        borderLeft: '3px solid',
        borderColor,
        pl: 1.5,
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: titleWeight, color: titleColor, lineHeight: 1.4 }}>
        {item.title}
      </Typography>
      <Typography sx={subheadingSx}>{item.subheading}</Typography>

      {item.kind === 'static' && item.blurb ? (
        <Typography
          sx={{
            fontSize: 12,
            color: 'text.primary',
            mt: 0.5,
            lineHeight: 1.45,
          }}
        >
          {item.blurb}
        </Typography>
      ) : null}

      {item.kind === 'static' && item.accentLabel ? (
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 700,
            color: 'error.main',
            letterSpacing: 0.6,
            mt: 0.75,
          }}
        >
          {item.accentLabel}
        </Typography>
      ) : null}

      {item.kind === 'actionable' ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.25, mt: 1 }}>
          {item.actions.map((action) =>
            'href' in action ? (
              <Button
                key={action.id}
                component={Link}
                to={action.href}
                variant="text"
                size="small"
                color={isDanger ? 'error' : 'primary'}
                sx={tertiaryButtonSx}
              >
                {action.label}
              </Button>
            ) : (
              <Button
                key={action.id}
                type="button"
                variant="text"
                size="small"
                color={isDanger ? 'error' : 'primary'}
                sx={tertiaryButtonSx}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ),
          )}
        </Box>
      ) : null}
    </Box>
  );
}
