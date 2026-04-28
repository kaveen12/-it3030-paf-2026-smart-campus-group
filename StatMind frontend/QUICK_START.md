# Quick Start - Incident Ticketing System Frontend

## ✅ Everything is Ready!

All files have been created and configured. Your React + Tailwind CSS frontend is complete.

---

## 🚀 Start Here

### 1. Start the Frontend
```bash
cd "StatMind frontend"
npm run dev
```
Open browser to: `http://localhost:5173`

### 2. Ensure Backend is Running
```bash
cd StatMind-backend
# Run your Spring Boot application (port 8080)
```

### 3. Start Using!
Navigate to the dashboard and create your first ticket.

---

## 📱 What You Can Do

### Dashboard (`/tickets`)
- ✅ View all tickets with summary cards
- ✅ Filter by Status, Priority, Category
- ✅ Search by resource name or location
- ✅ Quick action to view ticket details
- ✅ Create button to add new tickets

### Create Ticket (`/tickets/create`)
- ✅ Fill in ticket information
- ✅ Select resource or enter location
- ✅ Choose category and priority
- ✅ Add detailed description
- ✅ Provide contact information
- ✅ Form validation with error messages

### Ticket Details (`/tickets/:id`)
**Details Tab:**
- View all ticket information
- Show resource details
- Display status and assignment
- View rejection/resolution notes
- See timestamps and creator info
- Manage attachments (max 3)

**Action Buttons:**
- Assign Technician
- Update Status
- Reject Ticket
- Resolve Ticket
- Add Attachment
- Delete Ticket

**Comments Tab:**
- Add comments with author info
- Edit/delete your comments
- View comment history

**Activity Tab:**
- Beautiful timeline of all actions
- See who did what and when
- Complete audit trail

---

## 🎨 Design Colors

| Element | Color |
|---------|-------|
| OPEN Status | Blue |
| IN_PROGRESS | Yellow |
| RESOLVED | Green |
| CLOSED | Gray |
| REJECTED | Red |
| LOW Priority | Green |
| MEDIUM Priority | Blue |
| HIGH Priority | Orange |
| CRITICAL Priority | Red |

---

## 📂 File Organization

```
src/
├── api/ticketService.js          ← API calls to backend
├── components/                    ← Reusable UI components
│   ├── StatusBadge.jsx
│   ├── PriorityBadge.jsx
│   ├── Modal.jsx
│   ├── TicketTable.jsx
│   ├── TicketForm.jsx
│   ├── CommentsSection.jsx
│   └── ActivityLogTimeline.jsx
├── pages/                         ← Full page components
│   ├── TicketDashboard.jsx
│   ├── CreateTicket.jsx
│   └── TicketDetail.jsx
└── App.jsx                        ← Main routing
```

---

## 🔌 Backend Connection

All API calls go to: `http://localhost:8080/api`

If you need to change the backend URL:
1. Open `src/api/ticketService.js`
2. Find: `const API_BASE_URL = 'http://localhost:8080/api'`
3. Change to your backend URL

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to backend" | Ensure Spring Boot is running on port 8080 |
| Styles look broken | Run `npm install` and restart `npm run dev` |
| Page won't load | Check browser console for errors |
| API errors | Check backend logs for error details |

---

## 📚 Component Usage Examples

### Using TicketForm
```jsx
<TicketForm 
  onSubmit={handleSubmit} 
  loading={false}
/>
```

### Using StatusBadge
```jsx
<StatusBadge status="OPEN" />
```

### Using Modal
```jsx
<Modal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="My Modal"
  footer={<button>Close</button>}
>
  Modal content here
</Modal>
```

---

## ✨ Features

✅ Create tickets with validation
✅ Dashboard with summary statistics
✅ Advanced filtering system
✅ Full ticket lifecycle management
✅ Technician assignment
✅ Comments system
✅ Audit trail/Activity logs
✅ Attachment support
✅ Responsive design
✅ Professional UI

---

## 📦 Installed Packages

- `react` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client for API calls
- `tailwindcss` - CSS framework
- `vite` - Build tool

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

---

## 💡 Tips

1. **Save your work**: React hot-reloads your changes automatically
2. **Check console**: Browser console shows helpful error messages
3. **Test thoroughly**: Try all filters and form validations
4. **Check backend logs**: API errors show in backend console
5. **Use DevTools**: React DevTools browser extension is helpful

---

## 🎉 You're All Set!

Your Incident Ticketing System frontend is complete and ready to use.

**Next Steps:**
1. Start the dev server: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Create some test tickets
4. Try all the features
5. Deploy when ready!

---

**Need help?** Check SETUP_GUIDE.md for detailed documentation.
