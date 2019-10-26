import json, datetime
from django.urls import reverse
from rest_framework import status
from core.models import (
    Visit,
    UrgencyLevel,
    Medication,
    UrineDrugScreen,
    BehavioralHealthNotes,
    CaseManagement,
    HCVNotes
)
from core.tests.base import BaseTestCase


class VisitTests(BaseTestCase):
    fixtures = [
        "participants.yaml",
        "programs.yaml",
        "services.yaml",
        "program_service_map.yaml",
    ]

    def setUp(self):
        super().setUp()
        self.seed_fake_users()

    def test_create_visit(self):
        """
        Ensure we can create a new visit
        """
        headers = self.auth_headers_for_user("front_desk")
        url = reverse("visit-list")
        data = {
            "participant": 1,
            "program": 1,
            "service": 1,
            "notes": "hello prevention point",
            "urgency": "ONE",
        }
        response = self.client.post(url, data, format="json", follow=True, **headers)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Visit.objects.count(), 1)
        self.assertEqual(json.loads(response.content)["participant"]["id"], 1)
        self.assertEqual(json.loads(response.content)["program"]["id"], 1)

    def test_update_visit_notes(self):
        """
        Ensure we can update notes on a visit
        """
        # create a visit
        headers = self.auth_headers_for_user("front_desk")
        data = {
            "participant": 1,
            "program": 1,
            "service": 1,
            "urgency": UrgencyLevel.TWO.name,
        }
        create_response = self.client.post(
            "/api/visits/", data, format="json", **headers
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

        headers = self.auth_headers_for_user("case_manager")
        new_note = "I forgot to add notes the first time!"

        visit_id = json.loads(create_response.content)["id"]

        data = {"notes": new_note}
        update_response = self.client.patch(
            f"/api/visits/{visit_id}/", data, format="json", **headers
        )

        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(Visit.objects.count(), 1)
        self.assertEqual(Visit.objects.get(id=visit_id).notes, new_note)

    def test_get_visits(self):
        """
        Ensure we can get a list of visits
        """
        url = reverse("visit-list")
        headers = self.auth_headers_for_user("case_manager")

        # create 3 visits for each participant
        for participant in range(1, 4):
            data = {
                "participant": participant,
                "program": 1,
                "service": 2,
                "notes": "hello prevention point",
                "urgency": UrgencyLevel.THREE.name,
            }
            post_response = self.client.post(url, data, format="json", **headers)
            self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Visit.objects.count(), 3)

        # get the visits we just created
        get_response = self.client.get(url, **headers)
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)

    def test_get_visit_authorization(self):
        """
        Ensure front desk cannot retrieve visits
        """
        headers = self.auth_headers_for_user("front_desk")
        url = reverse("visit-list")

        get_response = self.client.get(url, **headers)
        self.assertEqual(get_response.status_code, status.HTTP_403_FORBIDDEN)


class VisitMedicalRelationsTests(BaseTestCase):
    fixtures = [
        "participants.yaml",
        "programs.yaml",
        "services.yaml",
        "program_service_map.yaml",
    ]

    def setUp(self):
        super().setUp()
        self.seed_fake_users()

    def test_create_visit_with_medical_data(self):
        """
        ensure medical models are linked correctly to visits
        """
        new_visit = {
            "participant_id": 1,
            "program_service_map_id": 1,
            "notes": "hello prevention point",
            "urgency": UrgencyLevel.TWO.name,
        }

        visit = Visit.objects.create(**new_visit)
        
        uds_data = {
            "visit_id": visit.pk,
            "date_of_test": datetime.datetime.now(),
            "uds_temp": "This is character field",
            "pregnancy_test": False,
            "opiates": False,
            "fentanyl": True,
            "bup": True,
            "coc": True,
            "amp": False,
            "m_amp": True,
            "thc": True,
            "mtd": True,
            "pcp": False,
            "bar": False,
            "bzo": False,
            "tca": False,
            "oxy": False,
        }

        uds = UrineDrugScreen.objects.create(**uds_data)

        meds = Medication.objects.create(
            medical_delivery="mouth",
            medication_name="advil",
            ingestion_frequency=100,
            visit_id=visit.pk,
        )

        case_mgmt = CaseManagement.objects.create(crs_seen=True, visit_id=visit.pk)

        health_notes = BehavioralHealthNotes.objects.create(
            visit_id=visit.pk,
            note_timestamp=datetime.datetime.now(),
            behavior_note="very healthy, much improvement seen",
        )

        hcv_notes = HCVNotes.objects.create(
            visit_id=visit.pk,
            note_timestamp=datetime.datetime.now(),
            hcv_note='important hcv note',
        )

        import pdb;pdb.set_trace()