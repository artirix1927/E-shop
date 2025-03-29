import { useState, useMemo } from 'react';

export const useFilterTickets = (tickets, filterParams) => {
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = filterParams.searchQuery
        ? ticket.user.username.toLowerCase().includes(filterParams.searchQuery.toLowerCase()) ||
          ticket.id.toString().includes(filterParams.searchQuery)
        : true;

      const matchesFilter = 
        filterParams.filter === 'all' ||
        (filterParams.filter === 'open' && !ticket.closed) ||
        (filterParams.filter === 'closed' && ticket.closed);

      return matchesSearch && matchesFilter;
    });
  }, [tickets, filterParams]);

  return filteredTickets
};