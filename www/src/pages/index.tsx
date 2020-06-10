import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';
import { Calendar } from '../components/calendar';

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <Calendar />
    </Layout>
  );
};

export default IndexPage;
