// Shared domain types for Quadrik

export type Role =
  | 'SUPER_ADMIN'
  | 'OWNER'
  | 'MANAGER'
  | 'RECEPTIONIST'
  | 'FINANCE'
  | 'TEACHER'
  | 'ORGANIZER'
  | 'PLAYER'

export type SportType = 'beach_tennis' | 'volleyball' | 'padel' | 'tennis' | 'beach_soccer'

export type SurfaceType = 'sand' | 'clay' | 'cement' | 'synthetic' | 'wood'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded'

export type TournamentStatus =
  | 'draft'
  | 'registration_open'
  | 'in_progress'
  | 'finished'
  | 'cancelled'

export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'walkover'

export type PlayerLevel = 'beginner' | 'intermediate' | 'advanced'

export type Gender = 'male' | 'female' | 'mixed'

export type TournamentFormat = 'group_knockout' | 'knockout' | 'round_robin'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
}

export interface ApiError {
  statusCode: number
  error: string
  message: string
  details?: Array<{ field: string; message: string }>
  timestamp: string
  path: string
}
