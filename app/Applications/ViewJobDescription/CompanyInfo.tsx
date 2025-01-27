import {StyleSheet, Text, View} from "react-native";

const CompanyInfo = ({role}: { role: string }) => {
    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Text style={styles.headerText}>Welcome</Text>
                <Text style={styles.normalText}>Thank you for using Job Bazaar</Text>
                <Text style={styles.normalText}>
                    We appreciate your {role === 'Applicant' ? 'application' : 'collaboration'}.{' '}
                    {role === 'Applicant'
                        ? 'Track your progress and sign up for job alerts. Stay updated on new opportunities and continue exploring career options with us.'
                        : 'Stay updated on new applicants and job postings. Track application progress and discover potential candidates to build your team with us.'}
                </Text>

                <Text style={styles.headerText}>About Us</Text>
                <Text style={styles.normalText}>Job Bazaar is an innovative job application platform designed to connect
                    employers with top talent
                    seamlessly. Employers can easily post job openings,
                    manage applications, and find the right candidates for their teams. Job seekers can explore a wide
                    range of job opportunities, apply directly through
                    the platform, and track their application status. Whether you're an employer looking to hire or a
                    job seeker aiming to advance your career, Job Bazaar
                    simplifies the recruitment process, making it efficient and user-friendly for everyone
                    involved.</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    childContainer: {
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "white",
        padding: 30,
        marginVertical: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 20
    },
    normalText: {
        fontSize: 16,
        letterSpacing: 0.5
    }
})
export default CompanyInfo