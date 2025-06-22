import { Router } from 'express';

const router = Router();

// Get political events
router.get('/events', async (req, res) => {
  try {
    const events = [
      {
        id: '1',
        title: 'Question Period',
        description: 'Daily parliamentary question period in the House of Commons',
        date: new Date('2025-06-23T19:00:00Z'),
        time: '2:00 PM',
        location: 'House of Commons, Parliament Hill',
        type: 'parliamentary',
        level: 'federal',
        cost: 'free',
        importance: 'high',
        attendees: 338,
        organizer: 'Parliament of Canada'
      },
      {
        id: '2',
        title: 'Committee on Public Accounts',
        description: 'Review of government spending and accountability measures',
        date: new Date('2025-06-24T15:00:00Z'),
        time: '10:00 AM',
        location: 'Committee Room 256-S, Centre Block',
        type: 'committee',
        level: 'federal',
        cost: 'free',
        importance: 'medium',
        attendees: 12,
        organizer: 'House of Commons'
      },
      {
        id: '3',
        title: 'Toronto City Council Meeting',
        description: 'Monthly city council meeting discussing local bylaws and budget',
        date: new Date('2025-06-25T14:00:00Z'),
        time: '9:30 AM',
        location: 'Toronto City Hall',
        type: 'council',
        level: 'municipal',
        cost: 'free',
        importance: 'high',
        attendees: 25,
        organizer: 'City of Toronto'
      },
      {
        id: '4',
        title: 'Ontario Legislature Session',
        description: 'Provincial legislative session discussing healthcare and education',
        date: new Date('2025-06-26T18:00:00Z'),
        time: '1:00 PM',
        location: 'Queen\'s Park, Toronto',
        type: 'legislative',
        level: 'provincial',
        cost: 'free',
        importance: 'high',
        attendees: 124,
        organizer: 'Government of Ontario'
      },
      {
        id: '5',
        title: 'Public Consultation on Climate Policy',
        description: 'Community input session on federal climate change initiatives',
        date: new Date('2025-06-27T19:00:00Z'),
        time: '7:00 PM',
        location: 'Vancouver Convention Centre',
        type: 'consultation',
        level: 'federal',
        cost: 'free',
        importance: 'medium',
        attendees: 200,
        organizer: 'Environment and Climate Change Canada'
      }
    ];
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching political events:', error);
    res.status(500).json({ message: 'Failed to fetch political events' });
  }
});

export default router;