const bcrypt = require('bcrypt');
const { sequelize, User, Activity, Stage } = require('./models');

const activities = [
  { title: 'Advance Digital Health', slug: 'advance-digital-health', type: 'dynamic', target: 'Number of digital health solutions piloted/implemented', target_unit: 'count' },
  { title: 'Boost Diagnostic and Treatment Capabilities', slug: 'boost-diagnostics-treatment', type: 'dynamic', target: 'New diagnostics/treatments investigated/validated', target_unit: 'count' },
  { title: 'Integrate Traditional and Conventional Medicine', slug: 'integrate-traditional-conventional', type: 'dynamic', target: 'Collaborative research projects', target_unit: 'count' },
  { title: 'Combat Emerging Infections and AMR', slug: 'combat-emerging-infections-amr', type: 'dynamic', target: 'Studies on emerging infections and AMR', target_unit: 'count' },
  { title: 'Strengthen Mental Health Support', slug: 'strengthen-mental-health', type: 'dynamic', target: 'Research projects focused on mental health service delivery models', target_unit: 'count' },
  { title: 'Building capacity in Research Administration', slug: 'capacity-research-administration', type: 'dynamic', target: 'Research administration processes improved', target_unit: 'count' },
  { title: 'Establish a population cohort for disease surveillance', slug: 'establish-population-cohort', type: 'dynamic', target: 'Participants enrolled', target_unit: 'count' },
  { title: 'Individuals for mental health', slug: 'individuals-mental-health', type: 'dynamic', target: 'Number of individuals for mental health', target_unit: 'count' },
  { title: 'Individuals for TB surveillance', slug: 'individuals-tb-surveillance', type: 'dynamic', target: 'Number of individuals for TB surveillance', target_unit: 'count' },
  { title: 'Developing a data repository', slug: 'data-repository', type: 'fixed', target: '% of data repository developed', target_unit: 'percent' },
  { title: 'Developing a biorepository', slug: 'biorepository', type: 'fixed', target: '% of biorepository developed', target_unit: 'percent' },
  { title: 'Consolidate applied research', slug: 'consolidate-applied-research', type: 'dynamic', target: 'New research studies developed', target_unit: 'count' },
  { title: 'Develop MRCU-Online', slug: 'develop-mrcu-online', type: 'fixed', target: '% of online activities', target_unit: 'percent' },
  { title: 'Disseminating research findings', slug: 'disseminate-research', type: 'dynamic', target: 'Publications per year', target_unit: 'count' },
  { title: 'Build strategic partnerships', slug: 'build-partnerships', type: 'dynamic', target: 'New collaborations', target_unit: 'count' },
  { title: 'Capacity building grants', slug: 'capacity-building-grants', type: 'dynamic', target: 'Capacity building grants', target_unit: 'count' },
  { title: 'Establish R&D infrastructure', slug: 'establish-rd-infrastructure', type: 'fixed', target: '% of infrastructure developed per year', target_unit: 'percent' },
  { title: 'Talent development and nurturing researchers', slug: 'talent-development', type: 'dynamic', target: 'Individuals with scientific products developed', target_unit: 'count' },
  { title: 'Young researchers mentored', slug: 'young-researchers-mentored', type: 'dynamic', target: 'Young researchers mentored', target_unit: 'count' },
  { title: 'Soft skills training', slug: 'soft-skills-training', type: 'dynamic', target: 'Number of staff trained in soft skills', target_unit: 'count' },
  { title: 'Preventive community health initiatives', slug: 'preventive-community-health', type: 'dynamic', target: 'Pilot implementations of adapted models', target_unit: 'count' },
  { title: 'Embed fellowships and advanced degrees', slug: 'embed-fellowships', type: 'dynamic', target: 'Individuals enrolled in advanced degrees', target_unit: 'count' },
  { title: 'Fellowships and post-doc placements', slug: 'fellowships-postdocs', type: 'dynamic', target: 'Fellowships/post-doctoral placements', target_unit: 'count' },
  { title: 'Embedded researchers contributing', slug: 'embedded-researchers', type: 'dynamic', target: 'Embedded fellows/Masters/PhDs/Post-docs engaged', target_unit: 'count' },
  { title: 'Develop grant writing capacity', slug: 'grant-writing-capacity', type: 'dynamic', target: 'Grant proposals submitted', target_unit: 'count' },
  { title: 'Increase grant success rate', slug: 'grant-success-rate', type: 'fixed', target: '% increase in success rate', target_unit: 'percent' },
  { title: 'Run MUREC', slug: 'run-murec', type: 'fixed', target: '% of new MUREC business developed', target_unit: 'percent' },
  { title: 'Explore VC and PPPs', slug: 'explore-vc-ppp', type: 'dynamic', target: 'New VC firms engaged', target_unit: 'count' },
  { title: 'New PPP agreements', slug: 'new-ppp-agreements', type: 'dynamic', target: 'New PPP agreements signed', target_unit: 'count' },
  { title: 'Joint research with industry', slug: 'joint-research-industry', type: 'dynamic', target: 'Joint research projects with industry', target_unit: 'count' },
  { title: 'Partnerships and networking', slug: 'partnerships-networking', type: 'dynamic', target: 'External stakeholder engagements per year', target_unit: 'count' },
  { title: 'Customer satisfaction', slug: 'customer-satisfaction', type: 'fixed', target: '% customer satisfaction per year', target_unit: 'percent' },
  { title: 'Staff satisfaction and performance', slug: 'staff-satisfaction', type: 'fixed', target: '% staff satisfaction rate', target_unit: 'percent' },
  { title: 'Timely staff appraisal rate', slug: 'timely-appraisal', type: 'fixed', target: '% timely staff appraisal rate', target_unit: 'percent' },
  { title: 'Staff achieving targets', slug: 'staff-achieving-targets', type: 'fixed', target: '% staff achieving set targets', target_unit: 'percent' },
  { title: 'AOP completion', slug: 'aop-completion', type: 'fixed', target: '% of activities completed targets', target_unit: 'percent' }
];

async function seed() {
  await sequelize.sync({ force: true });
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  await User.create({ email: 'admin@mrcu.local', passwordHash, role: 'admin' });
  await User.create({ email: 'user1@mrcu.local', passwordHash, role: 'user' });

  for (const act of activities) {
    const activity = await Activity.create(act);
    // default stages
    await Stage.bulkCreate([
      { name: 'Planned', order: 1, ActivityId: activity.id },
      { name: 'In Progress', order: 2, ActivityId: activity.id },
      { name: 'Completed', order: 3, ActivityId: activity.id }
    ]);
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
