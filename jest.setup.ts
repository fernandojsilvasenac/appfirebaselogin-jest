jest.mock("expo-router", () => ({
  Link: ({ children }: { children: any }) => children,
  router: {
    push: jest.fn()
  },
  useRouter: () => ({
    push: jest.fn()
  })
}));
