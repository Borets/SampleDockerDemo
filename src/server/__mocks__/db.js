const mockDb = {
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  join: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  count: jest.fn().mockReturnThis(),
};

module.exports = jest.fn(() => mockDb); 