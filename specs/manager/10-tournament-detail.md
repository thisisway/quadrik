# Screen: Tournament Detail (Manager)

**Route:** `/app/torneios/[id]`  
**Auth:** Required — OWNER, MANAGER, ORGANIZER  
**Purpose:** Full management of a specific tournament — all operations from a single route with tabs.

This is a sub-page of the Tournaments module. Full specification is included in [09-tournaments.md](./09-tournaments.md) under "Tournament Detail".

---

## Quick Reference

| Tab | Content |
|-----|---------|
| Visão Geral | Tournament info, dates, cover, public link |
| Categorias | Category CRUD |
| Inscrições | Registration list + confirmation |
| Chaveamento | Bracket generation and view |
| Partidas | Match schedule + result entry |
| Resultados | Podium + final standings |

## Key Actions

| Action | Trigger | Business Rule |
|--------|---------|---------------|
| Publicar torneio | Button in header | Changes status: `draft` → `registration_open`, visible publicly |
| Gerar chaveamento | Tab Inscrições | Only after registration deadline |
| Lançar resultado | Match row | Updates bracket + may update ranking |
| Publicar resultados | Tab Resultados | Makes results visible on public page |
| Encerrar torneio | Header button | Final status, no further changes allowed |
