import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AuthProvider } from '@/store/AuthContext'
import { ThemeProvider } from '@/store/ThemeContext'
import { ToastProvider } from '@/store/ToastContext'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { ROLES } from '@/constants'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { OfferListingPage } from '@/pages/public/OfferListingPage'
import { OfferDetailPage } from '@/pages/public/OfferDetailPage'
import { BookingConfirmationPage } from '@/pages/public/BookingConfirmationPage'
import { CancelBookingPage } from '@/pages/public/CancelBookingPage'
import { UserLoginPage } from '@/pages/public/UserLoginPage'
import { MyBookingsPage } from '@/pages/public/MyBookingsPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { ManageOffersPage } from '@/pages/admin/ManageOffersPage'
import { CreateOfferPage } from '@/pages/admin/CreateOfferPage'
import { ManageSlotsPage } from '@/pages/admin/ManageSlotsPage'
import { ManageBookingsPage } from '@/pages/admin/ManageBookingsPage'
import { BusinessProfilePage } from '@/pages/admin/BusinessProfilePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<PublicLayout />}>
                    <Route index element={<OfferListingPage />} />
                    <Route path="offers/:id" element={<OfferDetailPage />} />
                    <Route path="booking/confirmation/:reference" element={<BookingConfirmationPage />} />
                    <Route path="cancel/:token" element={<CancelBookingPage />} />
                    <Route path="login" element={<UserLoginPage />} />
                    <Route
                      path="account"
                      element={
                        <ProtectedRoute allowedRoles={[ROLES.Customer]} loginPath="/login">
                          <MyBookingsPage />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  <Route path="admin/login" element={<AdminLoginPage />} />

                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute allowedRoles={[ROLES.Admin]} loginPath="/admin/login">
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardPage />} />
                    <Route path="offers" element={<ManageOffersPage />} />
                    <Route path="offers/new" element={<CreateOfferPage />} />
                    <Route path="offers/:id/edit" element={<CreateOfferPage />} />
                    <Route path="offers/:offerId/slots" element={<ManageSlotsPage />} />
                    <Route path="bookings" element={<ManageBookingsPage />} />
                    <Route path="business" element={<BusinessProfilePage />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
