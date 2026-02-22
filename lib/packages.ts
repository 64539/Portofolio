export const PACKAGES = [
  {
    id: 'umkm-starter',
    title: 'UMKM Starter',
    startingPrice: 1000000,
    scope: [
      '1 Page Landing Page',
      'Template Based Layout',
      'Contact Form Integration',
      'Basic Mobile Responsive',
      '1 Round of Revision'
    ]
  },
  {
    id: 'business-website',
    title: 'Business Website',
    startingPrice: 3500000,
    scope: [
      '3-5 Pages',
      'Custom UI Design',
      'Basic SEO Optimization',
      'CMS Integration (Content Management)',
      '2 Rounds of Revisions'
    ]
  },
  {
    id: 'fullstack-app',
    title: 'Fullstack Web App',
    startingPrice: 10000000,
    scope: [
      'User Authentication',
      'Database Integration',
      'Admin Dashboard',
      'Custom API Development',
      'Complex Business Logic'
    ]
  },
  {
    id: 'custom-engineering',
    title: 'Custom Engineering',
    startingPrice: 15000000,
    scope: [
      'Microservices / Complex Architecture',
      'High Performance Optimization',
      'Scalable System Design',
      'Third-party Integrations',
      'Advanced Security Implementation'
    ]
  }
];

export function getPackageById(id: string) {
  return PACKAGES.find(pkg => pkg.id === id);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
