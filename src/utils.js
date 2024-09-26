import { SERVICENOW_TICKET_STATUS } from "./configs.js";

export const setServiceNowTicketStatus = (status) => {
    const { RESOLVED, CANCELLED, NEW } = SERVICENOW_TICKET_STATUS;

    if (status === "Cancelled") {
        return CANCELLED;
    }
    else if (status === "Resolved") {
        return RESOLVED;
    }
    else if (status === "New") {
        return NEW;
    }
}

const getServiceNowTicketStatus = (status) => {
    const { NEW, RESOLVED, CANCELLED } = SERVICENOW_TICKET_STATUS;
    if (status === NEW) {
        return "New";
    }
    else if (status === CANCELLED) {
        return "Cancelled";
    }
    else if (status === RESOLVED) {
        return "Resolved";
    }
}


export const formatServiceNowTicket = (ticket) => {
    return {
        ticket_id: ticket.sys_id,
        ticket_title: ticket.short_description,
        ticket_description: ticket.description,
        ticket_status: getServiceNowTicketStatus(ticket.state),
    };
}