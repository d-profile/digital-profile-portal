import NextLink from 'next/link'
import React from "react"
import {
  Link,
  Container,
  Heading,
  Box,
  SimpleGrid,
  Button,
  List,
  ListItem,
  Text,
  Stack,
  useColorModeValue,
  chakra
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import axios from "axios"
import Paragraph from '../../components/paragraph'
import { BioSection, BioYear, BioImage, CertDescription, CertSection } from '../../components/bio'
import Layout from '../../components/layouts/article'
import Section from '../../components/section'
import { GridItem } from '../../components/grid-item'
import { IoLogoTwitter, IoLogoInstagram, IoLogoGithub } from 'react-icons/io5'
import thumbYouTube from '../../public/images/links/youtube.png'
import thumbInkdrop from '../../public/images/works/inkdrop_eyecatch.png'
import Image from 'next/image'

const BASE_API = process.env.BASE_API

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const api = axios.create({
  baseURL: BASE_API,
  timeout: 60000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Content-Type': 'application/json'
  }
})


export async function getServerSideProps(context) {
  try {
    const profileData = await api.post(`/api/v1/user/getProfile`, {
      address: context.query.address
    }) 

    const claims = await api.post('/api/v1/claim/getClaimsByIdentityAddress', {
      identityAddress: profileData.data.data.identityAddress
    })

    console.log(claims)
    if (profileData.data.errorCode != 1 || claims.data.errorCode != 1) {
      return {
        notFound: true
      }
    }
    return {
      props: {
        profileData: {
          ...profileData.data.data
        },
        certifications: [
          {
            title: "Certified Bitcoin Professional",
            issuerAddress: "0x57a3518696a3238963a8c2a919c1f9c0bfced872",
            issuerName: "Ho Chi Minh University of Technology",
            description: "Cryptocurrentcy Certififaction Consortium (C4)",
            image: "https://pbs.twimg.com/profile_images/1438336320732950532/C5KS_t7n_400x400.jpg",
            transactionHash: "0x57a3518696a3238963a8c2a919c1f9c0bfced872",
            date: 1619624275
          },
          {
            title: "Chainlink Fall Hackathon 2021",
            issuerAddress: "0x57a3518696a3238963a8c2a919c1f9c0bfced872",
            issuerName: "Chainlink Foundation",
            description: "Top Quanlity Project Winner",
            image: "https://pbs.twimg.com/profile_images/1438336320732950532/C5KS_t7n_400x400.jpg",
            transactionHash: "0x57a3518696a3238963a8c2a919c1f9c0bfced872",
            date: 1619624275
          },
        ],
        works: [
          {
            title: "Blockchain Developer",
            company: "Coin98 Finance",
            type: "Full-time",
            description: "hello",
            transactionHash: "0x57a3518696a3238963a8c2a919c1f9c0bfced872",
            timeStart: 1619624275,
            timeEnd: 0
          },
          {
            title: "Blockchain Developer",
            company: "Ethereum Foundation",
            type: "Freelancer",
            description: "hello",
            transactionHash: "0x57a3518696a3238963a8c2a919c1f9c0bfced872",
            timeStart: 1619624275,
            timeEnd: 1619624275,
          },
        ],
      }
    }
  } catch {
    return {
      notFound: true
    }
  }
}

const Home = (props) => {
  const { profileData, certifications, works } = props
  console.log("profile", profileData)
  console.log("certifications", certifications)
  console.log("works", works)
  
  return (
    <Layout>
      <Container>
        <Box
          borderRadius="lg"
          mb={6}
          mt={6}
          p={3}
          textAlign="center"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
          css={{ backdropFilter: 'blur(10px)' }}
        >
          Identity Address <Link href={`https://testnet.bscscan.com/address/${profileData.identityAddress}`} target="_blank"> <b>{profileData.identityAddress}</b> </Link>
        </Box>

        <Box display={{ md: 'flex' }}>
          <Box flexGrow={1} flexDirection={"column"}>
            <Heading as="h2" variant="page-title">
              {profileData.fullName}
            </Heading>
            <p>{profileData.sortDescription}</p>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            textAlign="center"
          >
            <Box
              borderColor="whiteAlpha.800"
              borderWidth={2}
              borderStyle="solid"
              w="150px"
              h="150px"
              display="inline-block"
              borderRadius="full"
              overflow="hidden"
            >
              <ProfileImage
                src={profileData.avatar}
                alt="Profile image"
                borderRadius="full"
                width="150%"
                height="150%"
              />
            </Box>
          </Box>
        </Box>

        <Section delay={0.1}>
          <Heading as="h3" variant="section-title">
            About
          </Heading>
          <Paragraph>
            {profileData.description}
          </Paragraph>
          <Box align="center" my={4}>
            <NextLink href="/works" scroll={false}>
              <Button rightIcon={<ChevronRightIcon />} colorScheme="teal">
                Connect to Me
              </Button>
            </NextLink>
          </Box>
        </Section>

        <Section delay={0.2}>
          <Heading as="h3" variant="section-title">
            Certifications 
          </Heading>
          {certifications.map(cert => {
            return (
              <CertSection mb="5">
                <BioImage>
                  <ProfileImage
                    src={cert.image}
                    alt="Profile image"
                    borderRadius="8px"
                    width="160px"
                    height="160px"
                  />
                </BioImage>
                <CertDescription>
                  <Link href={`https://testnet.bscscan.com/tx/${cert.transactionHash}`} target="_blank">
                    <Heading as="h5" variant="cert-title">
                      {cert.title}
                    </Heading>
                  </Link>
                  <Stack spacing={1}>
                    <Text>
                      {cert.description}
                    </Text>
                    <Text>
                      Issuer: <b>{cert.issuerName}</b>
                    </Text>
                    <Text>
                      {(new Date(cert.date)).toString()}
                    </Text>
                  </Stack>
                </CertDescription>
              </CertSection>
            )
          })}
        </Section>

        <Section delay={0.2}>
          <Heading as="h3" variant="section-title">
            Works Activities 
          </Heading>
          {works.map(work => {
            return (
              <CertSection mb="5">
                <BioYear>
                  2012 - 2013
                </BioYear>
                <CertDescription>
                  <Link href={`https://testnet.bscscan.com/tx/${work.transactionHash}`} target="_blank">
                    <Heading as="h5" variant="cert-title">
                      {work.title}
                    </Heading>
                  </Link>
                  <Stack spacing={1}>
                    <Text fontSize='md'>
                      {work.company} - {work.type}
                    </Text>
                    <Text>
                      {work.description}
                    </Text>
                  </Stack>
                </CertDescription>
              </CertSection>
            )
          })}
        </Section>

        <Section delay={0.3}>
          <Heading as="h3" variant="section-title">
            Activities
          </Heading>
          <SimpleGrid columns={[1, 2, 2]} gap={6}>
            <GridItem
              href="https://www.youtube.com/devaslife"
              title="Dev as Life"
              thumbnail={thumbYouTube}
            >
              My YouTube channel
            </GridItem>
            <GridItem
              href="https://www.inkdrop.app/"
              title="Inkdrop"
              thumbnail={thumbInkdrop}
            >
              A Markdown note-taking app
            </GridItem>
          </SimpleGrid>

          <Box align="center" my={4}>
            <NextLink href="/posts" scroll={false}>
              <Button rightIcon={<ChevronRightIcon />} colorScheme="teal">
                Popular posts
              </Button>
            </NextLink>
          </Box>
        </Section>
      </Container>
    </Layout>
  )
}

export default Home
