import React from 'react';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses }  from '@mui/material/Tooltip';

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

const InfoIconButton = ({ infoText, placement }) => {
    return (
        <LightTooltip
            title={
                <React.Fragment>
                    <div dangerouslySetInnerHTML={{ __html: infoText }} />
                </React.Fragment>
            }
            placement={placement || "top"}>
            <IconButton>
                <InfoIcon />
            </IconButton>
        </LightTooltip>
    );
};

export default InfoIconButton;
