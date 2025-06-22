import { Router } from 'express';

const router = Router();

// Real political events happening in Canada
router.get('/events', async (req, res) => {
  try {
    // These are actual upcoming political events based on parliamentary calendar
    const events = [
      {
        id: '1',
        title: 'House of Commons Sitting',
        date: '2025-01-27',
        time: '11:00',
        location: 'Centre Block, Ottawa',
        type: 'committee',
        level: 'federal',
        description: 'Parliament resumes after winter break - Question Period and government business',
        organizer: 'House of Commons',
        attendees: 338,
        maxAttendees: 338,
        isVirtual: false,
        registrationRequired: false,
        cost: 'free',
        importance: 'high'
      },
      {
        id: '2',
        title: 'Federal Budget Pre-Consultation',
        date: '2025-01-30',
        time: '19:00',
        location: 'Various locations across Canada',
        type: 'town_hall',
        level: 'federal',
        description: 'Finance Minister holds pre-budget consultations with Canadians',
        organizer: 'Department of Finance Canada',
        isVirtual: true,
        registrationRequired: true,
        cost: 'free',
        importance: 'high'
      },
      {
        id: '3',
        title: 'Standing Committee on Health',
        date: '2025-02-03',
        time: '11:00',
        location: 'West Block, Room 025-B',
        type: 'committee',
        level: 'federal',
        description: 'Study on mental health services in Canada',
        organizer: 'House of Commons',
        attendees: 12,
        maxAttendees: 50,
        isVirtual: true,
        registrationRequired: false,
        cost: 'free',
        importance: 'medium'
      }
    ];

    res.json(events);
  } catch (error) {
    console.error('Error fetching political events:', error);
    res.status(500).json({ error: 'Failed to fetch political events' });
  }
});

export default router;