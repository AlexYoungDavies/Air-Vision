import { SvgIcon, type SvgIconProps } from '@mui/material';

/** Recording control — source: Pause.svg */
export function PauseRecordingIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 20C15.3096 20 14.75 19.4404 14.75 18.75V5.25C14.75 4.55964 15.3096 4 16 4C16.6904 4 17.25 4.55964 17.25 5.25V18.75C17.25 19.4404 16.6904 20 16 20Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 20C7.30964 20 6.75 19.4404 6.75 18.75V5.25C6.75 4.55964 7.30964 4 8 4C8.69036 4 9.25 4.55964 9.25 5.25V18.75C9.25 19.4404 8.69036 20 8 20Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
