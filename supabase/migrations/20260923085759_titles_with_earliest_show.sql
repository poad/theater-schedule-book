-- Titles with their earliest show date, for server-side ordering by
-- year asc, then earliest show_date asc (shows-less titles last).
-- PostgREST cannot order parent rows by a to-many embed, so the
-- aggregation is done here instead of in the client query.
create or replace view titles_with_earliest_show
with (security_invoker = true) as
select
  distinct(base.id),
  base.name,
  base.year,
  base.url,
  base.user_id
from
(select
  t.id,
  t.name,
  t.year,
  t.url,
  t.user_id,
  min(s.show_date) as earliest_show_date
from titles t
left join titles_shows ts on ts.title_id = t.id
left join shows s on s.id = ts.show_id
group by t.id, s.show_date
order by
  t.year,
  earliest_show_date) as base
order by
  base.year;

grant select on titles_with_earliest_show to authenticated;
