import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  MenuItem,
  FormControlLabel,
  List,
  Divider,
} from '@mui/material';
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import { AppIconButton } from '../AppIconButton';
import {
  AppTextField,
  AppSearchField,
  AppSelectField,
  AppNavMenuItem,
  AppSwitch,
  pillTabsSx,
  underlineTabsSx,
} from '../ui';

function ComponentSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      </Box>
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</Box>
    </Paper>
  );
}

function DemoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          fontWeight: 700,
          color: 'text.secondary',
          mb: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>{children}</Box>
    </Box>
  );
}

export function ComponentsPage() {
  const [pillTab, setPillTab] = useState(0);
  const [underlineTab, setUnderlineTab] = useState(0);
  const [dropdownValue, setDropdownValue] = useState('option-a');
  const [searchValue, setSearchValue] = useState('');
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'auto',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Components
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Prototype component library for QA. Demos use the same shared primitives as the rest of the app —
            edits here propagate globally via{' '}
            <Typography component="span" variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
              src/components/ui/
            </Typography>{' '}
            and{' '}
            <Typography component="span" variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
              src/theme/
            </Typography>
            .
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <ComponentSection
            title="Button"
            description="Radius: 8px (S) / 10px (M) / 12px (L). Neutral outline uses a light border + tactile depth."
          >
            <DemoRow label="Primary">
              <Button variant="contained" color="primary" size="small">
                Small
              </Button>
              <Button variant="contained" color="primary" size="medium">
                Medium
              </Button>
              <Button variant="contained" color="primary" size="large">
                Large
              </Button>
            </DemoRow>
            <DemoRow label="Leading / trailing icons">
              <Button variant="contained" color="primary" size="small" startIcon={<AddOutlined />}>
                Add item
              </Button>
              <Button variant="contained" color="primary" size="medium" endIcon={<ArrowForwardOutlined />}>
                Continue
              </Button>
              <Button variant="outlined" color="inherit" size="medium" startIcon={<DownloadOutlined />}>
                Export
              </Button>
            </DemoRow>
            <DemoRow label="Neutral">
              <Button variant="outlined" color="inherit" size="small">
                Cancel
              </Button>
              <Button variant="outlined" color="inherit" size="medium">
                Secondary
              </Button>
            </DemoRow>
            <DemoRow label="Tertiary (ghost)">
              <Button variant="text" color="primary" size="small">
                View details
              </Button>
              <Button variant="text" color="primary" size="medium" startIcon={<AddOutlined />}>
                Add item
              </Button>
              <Button variant="text" color="primary" size="small" disabled>
                Disabled
              </Button>
            </DemoRow>
            <DemoRow label="States">
              <Button variant="contained" color="primary" size="small" disabled>
                Disabled
              </Button>
              <Button variant="outlined" color="inherit" size="small" disabled>
                Disabled
              </Button>
            </DemoRow>
          </ComponentSection>

          <ComponentSection
            title="Icon Button"
            description="Variants: primary, secondary (accent icon), emphasis (accent fill). Radius matches button sizes."
          >
            <DemoRow label="Variants — small">
              <AppIconButton tooltip="Primary" aria-label="Primary" variant="primary">
                <DownloadOutlined fontSize="small" />
              </AppIconButton>
              <AppIconButton tooltip="Secondary" aria-label="Secondary" variant="secondary">
                <FilterListOutlined fontSize="small" />
              </AppIconButton>
              <AppIconButton tooltip="Emphasis" aria-label="Emphasis" variant="emphasis">
                <AddOutlined fontSize="small" />
              </AppIconButton>
            </DemoRow>
            <DemoRow label="Sizes — primary">
              <AppIconButton tooltip="Small" aria-label="Small" size="small" variant="primary">
                <DownloadOutlined fontSize="small" />
              </AppIconButton>
              <AppIconButton tooltip="Medium" aria-label="Medium" size="medium" variant="primary">
                <DownloadOutlined />
              </AppIconButton>
              <AppIconButton tooltip="Large" aria-label="Large" size="large" variant="primary">
                <DownloadOutlined />
              </AppIconButton>
            </DemoRow>
            <DemoRow label="Sizes — emphasis">
              <AppIconButton tooltip="Small" aria-label="Small emphasis" size="small" variant="emphasis">
                <DownloadOutlined fontSize="small" />
              </AppIconButton>
              <AppIconButton tooltip="Medium" aria-label="Medium emphasis" size="medium" variant="emphasis">
                <DownloadOutlined />
              </AppIconButton>
              <AppIconButton tooltip="Large" aria-label="Large emphasis" size="large" variant="emphasis">
                <DownloadOutlined />
              </AppIconButton>
            </DemoRow>
          </ComponentSection>

          <ComponentSection
            title="Tab Menu"
            description="pillTabsSx / underlineTabsSx — src/components/ui/tabMenuStyles.ts"
          >
            <DemoRow label="Pill tabs">
              <Tabs value={pillTab} onChange={(_, v) => setPillTab(v)} sx={pillTabsSx}>
                <Tab label="Summary" />
                <Tab label="Insurance" />
                <Tab label="Cases" />
                <Tab label="Profile" />
              </Tabs>
            </DemoRow>
            <Divider />
            <DemoRow label="Underline tabs">
              <Tabs value={underlineTab} onChange={(_, v) => setUnderlineTab(v)} sx={underlineTabsSx}>
                <Tab label="Billing Rules" />
                <Tab label="Patient Statements" />
                <Tab label="Insurance Intake" />
              </Tabs>
            </DemoRow>
          </ComponentSection>

          <ComponentSection
            title="Nav Menu Item"
            description="AppNavMenuItem — src/components/ui/AppNavMenuItem.tsx"
          >
            <DemoRow label="States">
              <List sx={{ width: 200, p: 0 }}>
                <AppNavMenuItem
                  label="Patients"
                  icon={<GroupOutlined sx={{ fontSize: 18 }} />}
                  active
                />
                <AppNavMenuItem label="Visits" icon={<GroupOutlined sx={{ fontSize: 18 }} />} />
                <AppNavMenuItem label="Claims" icon={<GroupOutlined sx={{ fontSize: 18 }} />} />
              </List>
            </DemoRow>
          </ComponentSection>

          <ComponentSection
            title="Text Field"
            description="Heights: 28 / 36 / 44px. Radius 8px. Optional label above field. Outlined or filled (5% black) variants."
          >
            <DemoRow label="Outlined — sizes">
              <AppTextField label="Small" fieldSize="small" defaultValue="Maria Garcia" sx={{ width: 200 }} />
              <AppTextField label="Medium" fieldSize="medium" defaultValue="Maria Garcia" sx={{ width: 200 }} />
              <AppTextField label="Large" fieldSize="large" defaultValue="Maria Garcia" sx={{ width: 200 }} />
            </DemoRow>
            <DemoRow label="Filled — sizes">
              <AppTextField label="Small" fieldSize="small" fieldVariant="filled" placeholder="Enter value" sx={{ width: 200 }} />
              <AppTextField label="Medium" fieldSize="medium" fieldVariant="filled" placeholder="Enter value" sx={{ width: 200 }} />
            </DemoRow>
            <DemoRow label="States">
              <AppTextField label="Error" fieldSize="small" error helperText="Required field" sx={{ width: 200 }} />
              <AppTextField label="Disabled" fieldSize="small" disabled value="Read only" sx={{ width: 200 }} />
              <AppTextField fieldSize="small" placeholder="No label" sx={{ width: 200 }} />
            </DemoRow>
          </ComponentSection>

          <ComponentSection
            title="Dropdown Field"
            description="Same sizing, label, radius, and filled variant rules as text fields."
          >
            <DemoRow label="Outlined">
              <AppSelectField
                label="Status"
                fieldSize="small"
                value={dropdownValue}
                onChange={(e) => setDropdownValue(e.target.value as string)}
                formControlSx={{ width: 200 }}
              >
                <MenuItem value="option-a">Active</MenuItem>
                <MenuItem value="option-b">Pending</MenuItem>
                <MenuItem value="option-c">Closed</MenuItem>
              </AppSelectField>
              <AppSelectField
                label="Status"
                fieldSize="medium"
                value={dropdownValue}
                onChange={(e) => setDropdownValue(e.target.value as string)}
                formControlSx={{ width: 200 }}
              >
                <MenuItem value="option-a">Active</MenuItem>
                <MenuItem value="option-b">Pending</MenuItem>
              </AppSelectField>
            </DemoRow>
            <DemoRow label="Filled">
              <AppSelectField
                label="Facility"
                fieldSize="small"
                fieldVariant="filled"
                value="option-a"
                formControlSx={{ width: 200 }}
              >
                <MenuItem value="option-a">Main clinic</MenuItem>
                <MenuItem value="option-b">North campus</MenuItem>
              </AppSelectField>
            </DemoRow>
          </ComponentSection>

          <ComponentSection
            title="Search Field"
            description="AppSearchField — same field rules with a leading search icon."
          >
            <DemoRow label="Outlined">
              <AppSearchField
                fieldSize="small"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{ width: 240 }}
              />
              <AppSearchField
                fieldSize="medium"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{ width: 280 }}
              />
            </DemoRow>
            <DemoRow label="Filled">
              <AppSearchField
                fieldSize="small"
                fieldVariant="filled"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{ width: 240 }}
              />
            </DemoRow>
          </ComponentSection>

          <ComponentSection title="Switch" description="AppSwitch — inset knob inside track; accent fill when on. S: 28px hitbox (48×24 track, 20px knob). M: 36px hitbox (56×32 track, 28px knob).">
            <DemoRow label="Sizes">
              <AppSwitch size="small" checked={switchOn} onChange={(_, checked) => setSwitchOn(checked)} />
              <AppSwitch size="medium" checked={switchOn} onChange={(_, checked) => setSwitchOn(checked)} />
            </DemoRow>
            <DemoRow label="States">
              <AppSwitch size="small" disabled />
              <AppSwitch size="small" checked disabled />
            </DemoRow>
            <DemoRow label="With label">
              <FormControlLabel
                control={<AppSwitch size="small" checked={switchOn} onChange={(_, checked) => setSwitchOn(checked)} />}
                label="Include facesheet"
              />
              <FormControlLabel control={<AppSwitch size="medium" />} label="Disabled" disabled />
            </DemoRow>
          </ComponentSection>
        </Box>
      </Box>
    </Box>
  );
}
