import { Grid, Link, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ChannelsMenu } from "./ChannelsMenu"
import { GroupsMenu } from "./GroupMenu"

export const SmartHome = () => {
    let groups = useSelector(state => state.groups)
    let channels = useSelector(state => state.channels)
    let navigate = useNavigate()
    return (
        <Box padding={3}>
            <Grid margin={3}>
                {channels && <ChannelsMenu />}
                {!channels && <Typography>נראה שאין לך עדיין ערוצים קיימים להוספה לחץ <Link onClick={() => { navigate('/ControllerSetting',null) }}>כאן</Link></Typography>}
            </Grid>
            <Grid margin={3}>
                {groups && <GroupsMenu />}
                {!groups && <Typography>נראה שאין לך עדיין קבוצות מוגדרות להוספה לחץ <Link onClick={() => { navigate('/newGroup',null) }}>כאן</Link></Typography>}
            </Grid>
        </Box>
    )
}